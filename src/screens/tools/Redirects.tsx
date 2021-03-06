import React, { useState } from 'react'
import styled from 'styled-components'
import { useMe } from 'utils/hooks'
import { Text, Title, Button, Icon } from 'components'
import { gql, useQuery, useMutation } from 'gql'
import type { ShortenerRedirects } from 'gql/types'

const REDIRECTS = gql`
  query ShortenerRedirects {
    redirects {
      from
      to
      expires
    }
  }
`

const ADD_REDIRECT = gql`
  mutation SetRedirect($from: String!, $to: String!, $expires: Int) {
    setRedirect(from: $from, to: $to, expires: $expires)
  }
`

const DELETE_REDIRECT = gql`
  mutation DeleteRedirect($path: String!) {
    deleteRedirect(path: $path)
  }
`

const fields = ['from', 'to', 'expires']

type Redirect = GqlType<ShortenerRedirects['redirects'][number]> & {
  key: string
}

type Diff = { __added?: string[]; __removed?: string[] }

export default function Redirects() {
  const { me } = useMe()
  const [org, setOrg] = useState<Redirect[]>([])
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [diff, setDiff] = useState<Diff>({})
  const [addRedirect] = useMutation(ADD_REDIRECT)
  const [deleteRedirect] = useMutation(DELETE_REDIRECT)

  useQuery<ShortenerRedirects>(REDIRECTS, {
    onCompleted(data) {
      const reds = data.redirects.map(v => ({
        ...v,
        key: `${v.from}_${(Math.random() * 1e6) | 0}`,
      }))
      setOrg(reds)
      setRedirects(reds)
    },
  })

  function handleChange(key: string, field: 'from' | 'to' | 'expires', target) {
    if (!target.checkValidity()) return
    const value = field === 'expires' ? parseInt(target.value) : target.value
    const newDiff = { ...diff }
    const redOrg = org.find(v => v.key === key)
    const redNew: Redirect = {
      ...(redirects.find(v => v.key === key) as Redirect),
      [field]: value,
    }
    if (redOrg) {
      if (
        redOrg.from === redNew.from &&
        redOrg.to === redNew.to &&
        redOrg.expires === redNew.expires
      )
        delete newDiff[key]
      else
        newDiff[key] = Object.fromEntries(
          Object.entries(redNew).filter(
            ([k, v]) => fields.includes(k) && v !== redOrg[k]
          )
        )
    }

    setDiff(newDiff)
    setRedirects(
      redirects.map(r =>
        r.key === key
          ? {
              ...r,
              [field]: value,
            }
          : r
      )
    )
  }

  function remove(key) {
    setRedirects(redirects.filter(r => r.key !== key))
    if (key === 'NEW_REDIRECT') return
    setDiff({
      ...Object.fromEntries(Object.entries(diff).filter(([k]) => k !== key)),
      ...((diff.__added ?? []).includes(key)
        ? { __added: diff.__added?.filter(k => k !== key) }
        : { __removed: [...(diff.__removed ?? []), key] }),
    })
  }

  function add() {
    const key = Date.now().toString()

    setRedirects([
      ...redirects,
      { key, from: 'NEW_REDIRECT', to: 'NEW_TARGET' } as Redirect,
    ])
    setDiff({ ...diff, __added: [...(diff.__added ?? []), key] })
  }

  async function save() {
    if (diff.__added?.length) {
      const added = diff.__added.map(k =>
        redirects.find(({ key }) => k === key)
      )
      await Promise.all(added.map(variables => addRedirect({ variables })))
    }
    if (diff.__removed?.length) {
      const deleted = diff.__removed.map(v =>
        v.split('_').slice(0, -1).join('_')
      )
      await Promise.all(
        deleted.map(path => deleteRedirect({ variables: { path } }))
      )
    }
    delete diff.__added
    delete diff.__removed

    const changedPaths = Object.entries(diff)
      .filter(([, v]) => 'from' in (v as any))
      .map(([k]) => k)

    const modified = Object.entries(diff).map(([k, v]) => ({
      ...org.find(({ key }) => key === k),
      ...v,
    }))

    if (changedPaths.length)
      await Promise.all(
        changedPaths.map(v =>
          deleteRedirect({
            variables: {
              path: v.split('_').slice(0, -1).join('_'),
            },
          })
        )
      )

    if (modified.length)
      await Promise.all(modified.map(variables => addRedirect({ variables })))

    window.location.reload()
  }

  if (me?.role !== 'ADMIN')
    return (
      <S.Page>
        <Text>
          You're not an admin. Please make sure you're logged in with the
          correct account.
        </Text>
      </S.Page>
    )

  return (
    <S.Page>
      <Title>Redirects</Title>
      <Text>
        You can edit the custom redirects here.
        <br />
        <i>from</i> refers to the path entered after{' '}
        <a href="https://upfra.me">upfra.me/</a>.<br />
        <i>to</i> is the path that is appended to{' '}
        <a href="https://upframe.io">upframe.io/</a> in the redirect link. If
        you want to redirect to a different domain instead, enter the full url
        including the <i>http://</i> or <i>https://</i> in front.
        <br />
        <i>expires</i> is the time the redirect is cached in the browser in
        seconds. If the browser opens an <i>upfra.me</i> link that it has
        visited before in the specified time, it will load the redirect url
        immediately without checking with upfra.me if the redirect has been
        changed. If no value is set it defaults to 604800 (1&nbsp;week).
      </Text>
      <S.Table>
        <Title size={4}>from</Title>
        <Title size={4}>to</Title>
        <Title size={4}>expires</Title>
        <div />
        {redirects.flatMap(({ from, to, expires, key }) => [
          ...[from, to, expires].map((v, i) => (
            <input
              key={key + fields[i]}
              value={v || ''}
              onChange={({ target }) =>
                handleChange(key, fields[i] as any, target)
              }
              {...(fields[i] === 'expires'
                ? { type: 'number' }
                : { pattern: '[^\\s]+' })}
            />
          )),
          <Icon
            icon="close"
            key={key + 'remove'}
            onClick={() => remove(key)}
          />,
        ])}
        <Icon icon="add" onClick={add} />
      </S.Table>
      <S.Change>
        {Object.entries(diff).map(([k, v]) =>
          k.startsWith('__') ? (
            <pre key={k}>{`${k.slice(2)}: ${(k !== '__added'
              ? (v as string[]).map(k => k.split('_').slice(0, -1).join('_'))
              : (v as string[]).map(
                  k => redirects.find(({ key }) => key === k)?.from
                )
            ).join(', ')}`}</pre>
          ) : (
            <pre key={k}>
              <b>{k.split('_').slice(0, -1).join('_')}</b>
              {'   '}
              {Object.entries(v as string[])
                .map(
                  ([field, v]) =>
                    `${field.toUpperCase()}: ${
                      org.find(({ key }) => key === k)?.[field]
                    } -> ${v}`
                )
                .join('; ')}
            </pre>
          )
        )}
      </S.Change>
      {Object.keys(diff).length > 0 && <Button onClick={save}>save</Button>}
    </S.Page>
  )
}

const S = {
  Page: styled.div`
    padding: 2rem;
    max-width: 55rem;
    margin: auto;

    button {
      margin-top: 2rem;
    }
  `,

  Table: styled.div`
    display: grid;
    grid-template-columns: 2fr 3fr 1fr 2rem;
    grid-gap: 1rem;
    margin-top: 5rem;

    * {
      margin: 0;
    }

    input {
      border: none;
    }
  `,

  Change: styled.div`
    margin-top: 5rem;
    font-size: 14px;
  `,
}
