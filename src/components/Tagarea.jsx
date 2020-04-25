import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Chip } from '.'

function Tagarea({
  tags = [],
  input = '',
  onChange = () => {},
  onTagClick = () => {},
  ...props
}) {
  const ref = useRef()
  const [indent, setIndent] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current || !('MutationObserver' in window)) return
    const observer = new MutationObserver(mutations => {
      const node = Array.from(mutations[0].target.childNodes).slice(-1)[0]
      if (!node) return setIndent({ x: 0, y: 0 })

      const nodeBox = node.getBoundingClientRect()
      const parentBox = node.parentNode.getBoundingClientRect()
      const { paddingTop, paddingLeft, paddingRight } = getComputedStyle(
        node.parentNode
      )

      let x = nodeBox.right - parentBox.x
      let y = nodeBox.y - parentBox.y - parseInt(paddingTop)

      if (
        x >=
        parentBox.right -
          parentBox.left -
          parseInt(paddingLeft) -
          parseInt(paddingRight) -
          100
      ) {
        x = 0
        y += nodeBox.bottom - nodeBox.y
      }

      setIndent({
        x,
        y,
      })
    })
    observer.observe(ref.current, { childList: true })
    return () => observer.disconnect()
  }, [ref])

  return (
    <S.Wrap>
      <S.Textarea
        {...props}
        value={input}
        onChange={({ target }) => onChange(target.value)}
        indent={indent}
      ></S.Textarea>
      <S.Tags ref={ref}>
        {tags.map(tag => (
          <Chip key={tag} removable onClick={() => onTagClick(tag)}>
            {tag}
          </Chip>
        ))}
      </S.Tags>
    </S.Wrap>
  )
}

const lineHeight = 2.2

const S = {
  Wrap: styled.div`
    position: relative;
    background-color: #f1f3f4;
  `,

  Textarea: styled.textarea`
    padding: 0.7rem 1rem;
    border-radius: 0.3rem;
    color: var(--cl-text-medium);
    font: inherit;
    font-size: 1.2rem;
    box-sizing: border-box;
    resize: none;
    background-color: transparent;
    border: none;
    width: 100%;
    text-indent: ${({ indent }) => indent.x}px;
    margin-top: ${({ indent }) => indent.y}px;
    line-height: ${lineHeight}rem;

    &:focus {
      outline: none;
    }
  `,

  Tags: styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    pointer-events: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0.7rem 0.7rem;

    & > * {
      pointer-events: initial;
      box-sizing: border-box;
      margin: 0.2rem 0.3rem;
    }
  `,
}

export default Object.assign(Tagarea, S)
