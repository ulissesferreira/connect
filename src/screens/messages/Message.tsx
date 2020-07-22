import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { fragments, useQuery, gql } from 'gql'
import { ProfilePicture, Markdown } from 'components'
import Time from './Time'
import type { ChatUser, ChatUserVariables } from 'gql/types'
import Context from './MsgContext'
import { useHeight } from 'utils/hooks'

const USER_QUERY = gql`
  query ChatUser($id: ID!) {
    user(id: $id) {
      id
      name
      ...ProfilePictures
    }
  }
  ${fragments.person.profilePictures}
`

const picSize = '3.2rem'

interface Props {
  id: string
  content: string
  author: string
  date: Date
  stacked?: boolean
  focused?: boolean
  onLockFocus(v: boolean): void
  i?: number
  reportSize?(size: number, id: string): void
}

function Message({
  id,
  content,
  author,
  date,
  stacked = false,
  onLockFocus,
  focused,
  i,
  reportSize,
}: Props) {
  const { data } = useQuery<ChatUser, ChatUserVariables>(USER_QUERY, {
    variables: { id: author },
  })
  const ref = useRef() as React.MutableRefObject<HTMLElement>
  const height = useHeight(ref)

  useEffect(() => {
    if (typeof height !== 'number' || !reportSize) return
    reportSize(height, id)
  }, [height, reportSize, id])

  return (
    <S.Wrap
      {...(stacked && { 'data-stacked': true })}
      {...(focused !== undefined && {
        'data-focus': focused ? 'lock' : 'block',
      })}
      data-id={id}
      {...(reportSize && { ref })}
    >
      {!stacked ? (
        <ProfilePicture imgs={data?.user?.profilePictures} size={picSize} />
      ) : (
        <Time>{date}</Time>
      )}
      <S.Main>
        {stacked ? (
          <div />
        ) : (
          <S.Head>
            <S.Name>{data?.user?.name}</S.Name>
            <Time>{date}</Time>
          </S.Head>
        )}
        <Markdown text={content} />
      </S.Main>
      <Context id={id} onToggle={onLockFocus} i={i} />
    </S.Wrap>
  )
}

const S = {
  Wrap: styled.article`
    display: flex;
    flex-direction: row;
    padding: 0;
    flex-shrink: 0;
    position: relative;
    margin-top: 0.5rem;
    padding-right: 1rem;

    picture,
    img {
      width: ${picSize};
      height: ${picSize};
      flex-shrink: 0;
      border-radius: 1000px;
      margin-top: 0.25rem;
    }

    & > ${Time.sc} {
      opacity: 0;
      width: ${picSize};
      text-align: right;
      line-height: 1.5rem;
    }

    &:not([data-focus='block']):hover,
    &[data-focus='lock'] {
      background-color: #eee6;

      ${Time.sc} {
        opacity: initial;
      }

      ${Context.sc} {
        display: initial;
      }
    }
  `,

  Main: styled.div`
    padding-left: 1rem;
    flex-grow: 1;
  `,

  Head: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2rem;
  `,

  Name: styled.span`
    margin-right: 1.1rem;
    color: #000;
    font-weight: 500;
  `,
}

export default Object.assign(Message, S)