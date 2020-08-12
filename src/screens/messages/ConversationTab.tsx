import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ProfilePicture, Title, Text, Checkbox, Identicon } from 'components'
import { useMe } from 'utils/hooks'
import { Link } from 'react-router-dom'
import { path } from 'utils/url'
import type { Participant } from 'gql/types'
import { Conversation } from 'conversations'
import { useParticipants } from 'conversations/hooks'

type User = Exclude<Participant['user'], null>

interface Props {
  id: string
  selected?: boolean
  onSelect(v: boolean): void
  userIds?: string[]
  users?: User[]
}

export default function User({
  id,
  selected,
  onSelect,
  userIds = [],
  users = [],
}: Props) {
  const [conversation, setConversation] = useState<Conversation>()
  const [hasUnread, setHasUnread] = useState(false)
  const { me } = useMe()
  const participants = useParticipants(userIds)

  users = [...users, ...participants]

  const CondLink = id ? Link : React.Fragment

  useEffect(() => {
    if (typeof onSelect === 'function' || !id || conversation) return
    Conversation.get(id).then(setConversation)
  }, [id, onSelect, conversation])

  useEffect(() => {
    if (!conversation) return
    setHasUnread(conversation.hasUnread)
    return conversation.on('unread', setHasUnread)
  }, [conversation])

  if (!users.length) return <S.User data-state="loading" />
  return (
    <S.User
      {...(typeof onSelect === 'function' && {
        onClick: () => onSelect(!selected),
      })}
      data-active={path(2).split('/').pop() === id}
    >
      {/* @ts-ignore */}
      <CondLink {...(id && { to: `${path(1)}/${id}` })}>
        {users.length > 1 ? (
          <Identicon
            ids={Array.from(
              new Set([me?.id, ...users.map(({ id }) => id)].filter(Boolean))
            )}
          />
        ) : (
          <ProfilePicture imgs={users[0]?.profilePictures} size="3rem" />
        )}
        <S.TextSec>
          <Title size={4}>
            {users.length === 1
              ? users[0].name
              : users.map(({ displayName }) => displayName).join(', ')}
          </Title>
          <Text>
            {users.length > 1
              ? `${users.length + 1} participants`
              : users[0]?.headline ?? '\u00a0'}
          </Text>
        </S.TextSec>
        {typeof onSelect === 'function' && (
          <Checkbox checked={selected as boolean} onChange={onSelect} />
        )}
        {hasUnread && <S.Unread />}
      </CondLink>
    </S.User>
  )
}

const S = {
  User: styled.li`
    list-style: none;
    display: flex;
    align-items: center;
    border-radius: 0.5rem;
    margin: 1rem 0;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    min-width: 0;
    box-sizing: border-box;
    user-select: none;
    height: 3.4rem;
    overflow: hidden;

    &[data-state='loading'] {
      background-color: #0002;

      &::after {
        --width: 20%;

        content: '';
        display: block;
        width: var(--width);
        left: calc(50% - var(--width) / 2);
        position: relative;
        top: -0.2rem;
        height: 150%;
        background: linear-gradient(90deg, #fff0, #fff6, #fff0);
        animation: swipe 1.5s infinite;

        @keyframes swipe {
          from {
            transform: translateX(-500%);
          }

          to {
            transform: translateX(500%);
          }
        }
      }
    }

    picture,
    img {
      border-radius: 50%;
    }

    input {
      flex-shrink: 0;
      margin-left: 0.5rem;
    }

    & > a {
      display: contents;
    }

    &[data-active='true'],
    &:hover {
      background-color: #0000000c;
    }
  `,

  TextSec: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    flex-grow: 1;
    padding-left: 1rem;
    box-sizing: border-box;
    min-width: 0;

    * {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      flex: 0 1 auto;
    }
  `,

  Unread: styled.div`
    display: block;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    background-color: var(--cl-accent);
    flex-shrink: 0;
  `,
}
