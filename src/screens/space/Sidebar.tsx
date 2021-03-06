import React from 'react'
import styled from 'styled-components'
import { parseSize } from 'utils/css'
import { path } from 'utils/url'
import type { SpacePage } from 'gql/types'
import { Title, ProfilePicture, Link, Markdown } from 'components'
import { useHistory } from 'react-router-dom'
import layout from 'styles/layout'
import { mobile } from 'styles/responsive'

interface Props {
  owners: Exclude<SpacePage['space'], null>['owners']
  members: Exclude<SpacePage['space'], null>['members']
  sidebar?: string | null
}

export default function Sidebar(props: Props) {
  return (
    <S.Sidebar>
      {props.sidebar && <Overview>{props.sidebar}</Overview>}
      <Avatars {...props} />
    </S.Sidebar>
  )
}

function Overview({ children }) {
  return (
    <S.Overview>
      <Title size={3}>Overview</Title>
      <Markdown text={children} />
    </S.Overview>
  )
}

function Avatars({ owners, members }: Props) {
  useHistory()
  const isPeoplePage = /people$/.test(window.location.href)

  if (!members?.length && !owners?.length) return null
  return (
    <S.Avatars>
      {owners && owners.length > 0 && (
        <>
          <Title size={3}>Owners</Title>
          <S.Group>
            {owners
              .slice(0, 2 * avatarsPerRow)
              .map(({ id, profilePictures, handle }) => (
                <S.Avatar key={`owner-${id}`}>
                  <ProfilePicture
                    imgs={profilePictures}
                    size={avatarSize}
                    linkTo={`/${handle}`}
                  />
                </S.Avatar>
              ))}
          </S.Group>
        </>
      )}
      {members && members.length > 0 && (
        <>
          <Title size={3}>Founders</Title>
          <S.Group>
            {members
              .slice(0, 2 * avatarsPerRow)
              .map(({ id, profilePictures, handle }) => (
                <S.Avatar key={`member-${id}`}>
                  <ProfilePicture
                    imgs={profilePictures}
                    size={avatarSize}
                    linkTo={`/${handle}`}
                  />
                </S.Avatar>
              ))}
          </S.Group>
          {members.length > avatarsPerRow * 2 && !isPeoplePage && (
            <S.More>
              <Link to={`${path(2)}/people`}>View more &gt;</Link>
            </S.More>
          )}
        </>
      )}
    </S.Avatars>
  )
}

export const sidebarWidth = parseSize('18rem')
const avatarsPerRow = 5
const avatarGap = '0.5rem'
const avatarSize =
  (sidebarWidth -
    parseSize('2rem') -
    (avatarsPerRow - 1) * parseSize(avatarGap)) /
  avatarsPerRow

const Widget = styled.div`
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background-color: #f1f3f4;

  &:not(:last-of-type) {
    margin-bottom: 2rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #000;
    margin-bottom: 0.5rem;

    &:not(:first-of-type) {
      margin-top: 1rem;
    }
  }
`

const S = {
  Sidebar: styled.div`
    position: fixed;
    right: var(--side-padding);
    top: calc(${layout.desktop.navbarHeight});
    height: calc(100vh - ${layout.desktop.navbarHeight});
    padding: 2rem 0;
    flex: 0 0;
    display: flex;
    flex-direction: column;
    width: ${sidebarWidth}px;
    box-sizing: border-box;
    overflow-y: auto;

    @media ${mobile} {
      position: initial;
      width: 100%;
      height: initial;
      padding: unset;
    }
  `,

  Avatars: styled(Widget)``,

  Group: styled.div`
    display: grid;
    grid-template-columns: repeat(${avatarsPerRow}, 1fr);
    grid-gap: ${avatarGap};
    overflow-x: hidden;
    width: 100%;

    @media ${mobile} {
      grid-template-columns: repeat(auto-fill, ${avatarSize}px);
    }
  `,

  Avatar: styled.div`
    width: ${avatarSize}px;
    height: ${avatarSize}px;
    border-radius: 50%;
    overflow: hidden;
  `,

  More: styled.span`
    margin-top: 1rem;
    display: block;

    a {
      font-size: 0.9rem;
      color: var(--cl-text-medium);
    }
  `,

  Overview: styled(Widget)`
    overflow-wrap: break-word;
  `,
}
