import React, { useState } from 'react'
import * as S from './styles'
import type { Columns } from './filter'
import Cell from './ContentCell'
import RowActions from './RowActions'

type Row = { [c: string]: any }

interface Props<T extends readonly string[]> {
  columns: Columns
  rows: Row[]
  selected: string[]
  setSelected(v: string[]): void
  onCellEdit?(
    cells: {
      row: string
      column: string
      value: string | number
    }[]
  ): void
  actions: T
  onAction(action: T[number], row: string): void
}

export default function Body<T extends readonly string[]>({
  columns,
  rows,
  selected,
  setSelected,
  onCellEdit,
  actions,
  onAction,
}: Props<T>) {
  const [edited, setEdited] = useState<{ [k: string]: string | number }>({})

  function onSelect(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: Row) {
    if (!e.shiftKey || !selected.length)
      return setSelected(
        selected.includes(row.id)
          ? selected.filter(id => id !== row.id)
          : [...selected, row.id]
      )
    const ids: string[] = rows.map(({ id }) => id)
    const bounds = [selected.slice(-1)[0], row.id].map(id => ids.indexOf(id))
    if (bounds[1] > bounds[0]) bounds[1] += 1
    setSelected(
      Array.from(
        new Set([
          ...selected,
          ...ids.slice(Math.min(...bounds), Math.max(...bounds)),
        ])
      )
    )
  }

  return (
    <>
      {rows.map(row => (
        <S.Row key={row.id} data-selected={selected.includes(row.id)}>
          <S.Select onClick={e => onSelect(e, row)} clickable>
            <input
              type="checkbox"
              checked={selected.includes(row.id)}
              readOnly
            />
          </S.Select>
          {Object.entries(columns).map(([name, conf]) => {
            const key = `${row.id}#${name}`
            return (
              <Cell
                key={key}
                column={{ name, ...conf }}
                {...(conf.type !== 'list'
                  ? {
                      value:
                        edited[key] ??
                        (conf.displayField
                          ? row[name]?.[conf.displayField]
                          : row[name]),
                    }
                  : {
                      values: row[name]?.map(
                        v => v?.[conf.displayField as string]
                      ),
                    })}
                editable={conf.editable ?? false}
                edited={key in edited}
                onEdit={v =>
                  setEdited({
                    ...Object.fromEntries(
                      Object.entries(edited).filter(([k]) => k !== key)
                    ),
                    ...(v !==
                    (conf.displayField
                      ? row[name]?.[conf.displayField]
                      : row[name])
                      ? { [key]: v }
                      : {}),
                  })
                }
              />
            )
          })}
          <RowActions
            id={row.id}
            actions={
              Object.keys(edited).find(k => k.startsWith(row.id))
                ? ['save', 'cancel']
                : actions
            }
            cta={['save']}
            onAction={action => {
              if (action === 'cancel')
                setEdited(
                  Object.fromEntries(
                    Object.entries(edited).filter(
                      ([k]) => !k.startsWith(row.id)
                    )
                  )
                )
              else if (action === 'save') {
                onCellEdit?.(
                  Object.entries(edited)
                    .filter(([k]) => k.split('#')[0] === row.id)
                    .map(([k, value]) => {
                      const [row, column] = k.split('#')
                      return {
                        row,
                        column,
                        value,
                      }
                    })
                )
              } else onAction(action, row.id)
            }}
            disabled={selected.length > 0}
          />
        </S.Row>
      ))}
    </>
  )
}
