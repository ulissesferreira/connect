import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useLayoutEffect,
} from 'react'
import styled from 'styled-components'
import { DynamicScroller } from 'utils/scroller'
import Cache from 'utils/sumCache'

interface Props {
  size(index: number): number
  Child(...args: any[]): JSX.Element
  props(index: number): any
  min?: number
  max?: number
  buffer?: number
  startAt?: number
  anchorBottom?: boolean
  update?: [number, boolean?][]
  onUpdate?(i: number): void
}

const VirtualScroller: React.FunctionComponent<Props> = ({
  size,
  Child,
  props,
  min = -Infinity,
  max = Infinity,
  buffer = 2,
  startAt,
  anchorBottom = false,
  update,
  onUpdate,
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const [height, setHeight] = useState<number>()
  const [children, setChildren] = useState<ReturnType<Props['Child']>[]>([])
  const [offTop, setOffTop] = useState(0)
  const [offBottom, setOffBottom] = useState(0)
  const [cache, setCache] = useState(new Cache(size))
  const [preScrollDone, setPreScrollDone] = useReducer(() => true, false)
  const [upCount, forceUpdate] = useReducer((_, off) => ({ off }), {
    off: 0,
  })
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    setCache(new Cache(size))
  }, [size])

  const [scroller, setScroller] = useState<
    DynamicScroller<ReturnType<Props['Child']>>
  >()

  useEffect(() => {
    if (!scroller || !cache) return
    if (scroller.max !== max) {
      scroller.max = max
      forceUpdate(0)
    }

    if (scroller.min !== min) {
      let dv = cache.sum(
        Math.min(min, scroller.min),
        Math.max(min, scroller.min) - 1
      )

      if (min > scroller.min) dv *= -1
      scroller.min = min
      forceUpdate(dv)
    }
  }, [min, max, scroller, cache])

  useEffect(() => {
    if (!scroller) return
    scroller.getCursor = i => <Child key={i} {...props(i)} />
  }, [props, scroller])

  useEffect(() => {
    if (!ref.current?.parentElement) return
    setHeight(ref.current.parentElement.offsetHeight)
  }, [ref])

  useEffect(() => {
    if (!ref.current || !scroller || !preScrollDone) return
    const node = ref.current
    let lastPos = node.scrollTop
    let lastScroll = performance.now()
    let animFrame: number

    function getOffset(n: number): number {
      if (n === scroller?.min) return 0
      return cache.sum(scroller?.min ?? 0, n - 1)
    }

    function offsetTop() {
      if (!scroller) return 0
      const i = cache.searchSum(node.scrollTop, scroller.min)
      return Math.max(i - 1, scroller.min)
    }

    function checkScroll(force = false): boolean | void {
      if (!scroller || !cache) return
      if (!force) animFrame = requestAnimationFrame(() => checkScroll())
      if (node.scrollTop === lastPos && !force) return

      lastPos = node.scrollTop
      lastScroll = performance.now()

      const ot = offsetTop()

      let { frame, off } = scroller.read(ot)
      setChildren(frame)

      const offTop = getOffset(ot - (scroller.buffer - off))

      setOffTop(offTop)

      const buffBottStart = ot + frame.length + off - scroller.buffer

      setOffBottom(
        buffBottStart > scroller.max
          ? 0
          : cache.sum(Math.min(buffBottStart, scroller.max), scroller.max)
      )

      if (force) listenScrollStart()
    }

    let timeoutId: number

    function checkScrollStop() {
      if (performance.now() - lastScroll > 100) {
        cancelAnimationFrame(animFrame)
        listenScrollStart()
      } else timeoutId = setTimeout(checkScrollStop, 500)
    }

    function onScrollStart() {
      checkScroll()
      timeoutId = setTimeout(checkScrollStop, 500)
    }

    const listenScrollStart = () =>
      node.addEventListener('scroll', onScrollStart, {
        passive: true,
        once: true,
      })

    if (upCount.off && (!anchorBottom || scroller.read(offsetTop()).off >= 0)) {
      if (
        node.scrollTop + upCount.off + node.offsetHeight <=
        node.scrollHeight - node.offsetHeight
      ) {
        node.scrollBy({ top: upCount.off })
      } else setScroll(upCount.off)
    }

    checkScroll(true)

    return () => {
      node.removeEventListener('scroll', onScrollStart)
      cancelAnimationFrame(animFrame)
      clearTimeout(timeoutId)
    }
  }, [ref, scroller, cache, preScrollDone, upCount, anchorBottom])

  useLayoutEffect(() => {
    if (!scroll) return
    ref.current.scrollBy({ top: scroll })
    setScroll(0)
  }, [scroll])

  useEffect(() => {
    if (!update?.length || !scroller || !cache) return
    const i = update[0][0]
    if (onUpdate) onUpdate(i)
    const ci = cache.searchSum(ref.current.scrollTop, scroller.min)
    const dv = scroller.update(i)
    if (update[0][1]) ref.current.scrollBy({ top: dv })
    else forceUpdate(ci > i ? dv : 0)
  }, [update, onUpdate, scroller, cache])

  useEffect(() => {
    if (!height || !cache) return

    if ((scroller as any)?.sizeCache === cache) return

    const _scroller = new DynamicScroller(
      i => <Child key={i} {...props(i)} />,
      cache,
      buffer,
      height,
      min,
      max
    )
    setScroller(_scroller)

    if (typeof startAt === 'number')
      ref.current.scrollTo({ top: cache.sum(min, startAt - 1) })
    else if (anchorBottom)
      ref.current.scrollTo({
        top: cache.sum(min, max) - ref.current.offsetHeight,
      })

    setPreScrollDone()
  }, [size, cache, height])

  return (
    <S.Wrap>
      <S.Scroller
        ref={ref}
        paddTop={offTop}
        paddBottom={offBottom}
        itemSize="3rem"
      >
        {children}
        <S.Placeholder />
      </S.Scroller>
    </S.Wrap>
  )
}

interface ScScrollProps {
  paddTop: number
  paddBottom: number
  itemSize: string
}

const S = {
  Wrap: styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  `,

  Scroller: styled.div.attrs((p: ScScrollProps) => ({
    style: {
      '--padd-top': `${p.paddTop}px`,
      '--padd-bottom': `${p.paddBottom}px`,
    },
  }))<ScScrollProps>`
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
    overscroll-behavior: contain;
    max-height: 100%;

    & * {
      overflow-anchor: none;
    }

    & > * {
      transform: translateY(var(--padd-top));
    }
  `,

  Placeholder: styled.div`
    height: 0;
    margin-top: 20000px;
    position: relative;

    * + & {
      margin-top: 0;
      margin-bottom: var(--padd-bottom);
    }
  `,
}
export default Object.assign(VirtualScroller, { sc: S.Wrap })
