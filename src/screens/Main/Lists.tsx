import React from 'react'
import styled from 'styled-components'
import { Title, Text, ListCard } from '../../components'
import { queries, useQuery } from 'gql'
import type { Lists } from 'gql/types'

export default function Categories() {
  const { data: { lists = [] } = {} } = useQuery<Lists>(queries.LISTS)
  let repeat = parseInt(
    new URLSearchParams(window.location.search).get('listRepeat') ?? '1'
  )

  return (
    <>
      <Title size={2}>Top Categories</Title>
      <Text>How can we help? Start by picking one of our main categories.</Text>
      <S.Lists>
        {Array<typeof lists>(repeat)
          .fill(lists)
          .flatMap((lists, i) =>
            lists.map(list => <ListCard key={`${list.id}-${i}`} list={list} />)
          )}
      </S.Lists>
    </>
  )
}

const S = {
  Lists: styled.div`
    --padding-side: 15vw;
    --padding-vert: 1rem;

    display: flex;
    flex-direction: row;
    overflow-x: auto;
    height: calc(var(--list-width) * 0.34 + var(--padding-vert) * 2);
    box-sizing: border-box;
    width: 100vw;
    scroll-snap-type: x mandatory;
    margin-left: calc(var(--padding-side) * -1);
    padding-left: var(--padding-side);
    scroll-padding: var(--padding-side);
    padding-top: var(--padding-vert);
    padding-bottom: var(--padding-vert);

    @media (max-width: 1020px) {
      --padding-side: calc((100vw - 55rem) / 2);
    }

    @media (max-width: 57.75rem) {
      --padding-side: 2.5vw;
    }
  `,
}
