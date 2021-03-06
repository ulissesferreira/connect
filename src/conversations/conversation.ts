import api from 'api'
import type {
  FetchConversation,
  FetchConversationVariables,
  CreateConversation,
  CreateConversationVariables,
  CreateChannel,
  CreateChannelVariables,
  MarkRead,
  MarkReadVariables,
} from 'gql/types'
import * as gql from './gql'
import Channel from './channel'
import Message from './message'

export default class Conversation {
  private static instances: { [id: string]: Conversation } = {}
  private static staticEventHandlers: {
    [event in StaticEvent]: StaticEventHandler<event>[]
  } = {
    added: [],
    unread: [],
    message: [],
  }
  private eventHandlers: {
    [event in ConversationEvent]: ConversationEventHandler<event>[]
  } = {
    message: [],
    channel: [],
    unread: [],
  }
  private static staticUnread = 0
  private _unread = 0
  private get unread() {
    return this._unread
  }
  private set unread(v: number) {
    const du = v - this._unread
    this._unread = v
    Conversation.staticUnread += du
  }
  public get hasUnread() {
    return this.unread > 0
  }

  public static get staticHasUnread() {
    return Object.values(Conversation.instances).some(v => v.hasUnread)
  }

  private _channels: Channel[] = []
  public get channels() {
    return this._channels
  }

  public static initDone: (v?: unknown) => void
  private static init = new Promise(res => {
    Conversation.initDone = res
  })

  protected constructor(
    public readonly id: string,
    public readonly participants: string[],
    public lastUpdate: Date,
    channels: string[] = []
  ) {
    if (Conversation.instances[id]) return Conversation.instances[id]
    Conversation.instances[id] = this
    Conversation.staticEventHandlers.added?.forEach(handler => handler(this))
    channels.forEach(id => this.addChannel(Channel.get(id)))
  }

  public addChannel(channel: Channel): Channel {
    if (this.channels.includes(channel)) return channel
    this._channels.push(channel)
    const getTime = ({ id }: Channel) => parseInt(id.slice(0, 10))
    this._channels.sort((a, b) => getTime(b) - getTime(a))
    channel.on('message', msg => {
      this.lastUpdate = new Date()
      this.eventHandlers.message.forEach(handler => handler(msg))
      Conversation.staticEventHandlers.message.forEach(handler => handler(msg))
    })
    channel.on('unread', (read, d) => {
      if (!!this.unread !== !!(this.unread += d))
        this.eventHandlers.unread.forEach(handler => handler(!!this.unread))
      Conversation.setRead(channel, read)
      if (!(Conversation.staticUnread - d) !== !Conversation.staticUnread)
        Conversation.staticEventHandlers.unread.forEach(handler =>
          handler(Conversation.staticUnread > 0)
        )
    })
    this.eventHandlers.channel.forEach(handler => handler(channel))
    return channel
  }

  public static async get(id: string): Promise<Conversation> {
    await Conversation.init
    return id in Conversation.instances
      ? Conversation.instances[id]
      : await Conversation.fetch(id)
  }
  public static add(
    id: string,
    participants: string[],
    lastUpdate: Date,
    channels?: string[]
  ): Conversation {
    if (id in Conversation.instances) return Conversation.instances[id]
    return new Conversation(id, participants, lastUpdate, channels)
  }

  public static async create(participants: string[], firstMsg?: string) {
    const { data, errors } = await api.mutate<
      CreateConversation,
      CreateConversationVariables
    >({
      mutation: gql.CREATE_CONVERSATION,
      variables: { participants, msg: firstMsg },
    })
    const con = data?.createConversation
    if (!con) throw errors?.[0] ?? Error("couldn't create conversation")
    const conversation = new Conversation(
      con.id,
      con.participants.map(({ id }) => id),
      new Date()
    )
    con.channels?.forEach(({ id }) => conversation.addChannel(Channel.get(id)))
    return conversation
  }

  public async createChannel(msg?: string): Promise<Channel | null> {
    const { data } = await api.mutate<CreateChannel, CreateChannelVariables>({
      mutation: gql.CREATE_CHANNEL,
      variables: { conversationId: this.id, msg },
    })
    if (!data?.createThread?.id) return null
    return this.addChannel(Channel.get(data.createThread.id))
  }

  private static async fetch(id: string): Promise<Conversation> {
    const { data } = await api.query<
      FetchConversation,
      FetchConversationVariables
    >({
      query: gql.FETCH_CONVERSATION,
      variables: { id },
    })
    if (!data?.conversation)
      throw Error(`conversation with id ${id} doesn't exist`)
    return new Conversation(
      data.conversation.id,
      data.conversation.participants.map(({ id }) => id),
      new Date(data.conversation.lastUpdate ?? 0),
      data.conversation.channels.map(({ id }) => id)
    )
  }

  public static get list(): Conversation[] {
    return Object.values(Conversation.instances)
  }

  public static onStatic<T extends StaticEvent>(
    event: T,
    handler: StaticEventHandler<T>
  ) {
    // @ts-ignore
    Conversation.staticEventHandlers[event].push(handler)
    return () =>
      // @ts-ignore
      Conversation.staticEventHandlers[event].filter(v => v !== handler)
  }

  public on<T extends ConversationEvent>(
    event: T,
    handler: ConversationEventHandler<T>
  ) {
    // @ts-ignore
    this.eventHandlers[event].push(handler)
    return () => {
      // @ts-ignore
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        v => v !== handler
      )
    }
  }

  public static getByUsers(users: string[]) {
    return Object.values(Conversation.instances).find(
      ({ participants }) =>
        participants.length === users.length &&
        participants.every(id => users.includes(id))
    )
  }

  private static _read: { [channel: string]: string[] } = {}
  private static nextReadSync: number

  private static setRead(channel: Channel, msgs: string[]) {
    if (msgs.length === 0) return
    Conversation._read[channel.id] = Array.from(
      new Set([...(Conversation._read[channel.id] ?? []), ...msgs])
    )
    clearTimeout(Conversation.nextReadSync)
    Conversation.nextReadSync = setTimeout(() => {
      const read: typeof Conversation._read = JSON.parse(
        JSON.stringify(Conversation._read)
      )
      Conversation._read = {}
      api.mutate<MarkRead, MarkReadVariables>({
        mutation: gql.MARK_READ,
        variables: {
          input: Object.entries(read).map(([channel, msgs]) => ({
            channel,
            msgs,
          })),
        },
      })
    }, 2000)
  }
}

type StaticEvent = 'added' | 'unread' | 'message'
type StaticEventHandler<T extends StaticEvent> = (
  v: StaticEventPayload<T>
) => any
type StaticEventPayload<T extends StaticEvent> = T extends 'added'
  ? Conversation
  : T extends 'unread'
  ? boolean
  : Message

type ConversationEvent = 'message' | 'channel' | 'unread'
type ConversationEventHandler<T extends ConversationEvent> = (
  v: ConversationEventPayload<T>
) => any
type ConversationEventPayload<T extends ConversationEvent> = T extends 'message'
  ? Message
  : T extends 'channel'
  ? Channel
  : boolean
