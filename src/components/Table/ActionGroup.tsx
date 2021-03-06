import React from 'react'
import styled from 'styled-components'
import { Icon } from 'components'

const actions = {
  confirm: {
    icon: 'check',
  },
  cancel: {
    icon: 'close',
  },
  edit: {
    icon: 'edit',
  },
} as const

type Actions = {
  [k in keyof typeof actions]?: boolean
}

interface Props extends Actions {
  onAction?(action: keyof Actions): void
}

export default function ActionGroup({ onAction, ...rest }: Props) {
  return (
    <S.Group data-actions={Object.keys(rest).join(' ')}>
      {Object.entries(rest)
        .filter(([k, v]) => v)
        .map(([k]) => (
          <Icon
            key={`action-${k}`}
            icon={actions[k].icon}
            onClick={() => onAction?.(k as keyof Actions)}
            clickStyle={false}
          />
        ))}
    </S.Group>
  )
}

const S = {
  Group: styled.div`
    display: flex;
    min-height: 2rem;
    justify-content: space-between;
    align-items: center;

    & > * {
      height: 100%;
      cursor: pointer;
      margin: 0;
    }

    svg[data-icon='edit'] {
      fill: var(--cl-action-dark);
    }

    svg[data-icon='check'] {
      fill: var(--cl-confirm);
    }

    svg[data-icon='close'] {
      fill: var(--cl-cancel);
    }
  `,
}
