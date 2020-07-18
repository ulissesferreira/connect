import React from 'react'
import styled from 'styled-components'
import { Title, Text, Button } from 'components'

export default function EmptyRoom({ onToggleSelect }) {
  return (
    <S.Empty>
      <img
        src={process.env.REACT_APP_ASSETS + 'msg_postbox.png'}
        alt="postbox illustration"
      />
      <Title size={2}>There are no dumb questions.</Title>
      <Text>
        Message someone new to get advice on what you're working on. Or pick an
        existing conversation.
      </Text>
      <Button filled onClick={() => onToggleSelect(true)}>
        New message
      </Button>
    </S.Empty>
  )
}

const S = {
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    user-select: none;

    img {
      width: 28rem;
      max-width: 100%;
      height: auto;
    }

    & > * {
      margin: 1rem 0;
    }

    & > p {
      margin-top: 0.2rem;
      width: 42ch;
    }

    & > button {
      margin-top: 1.5rem;
    }
  `,
}
