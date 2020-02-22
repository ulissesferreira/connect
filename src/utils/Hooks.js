import { useState, useEffect, useContext } from 'react'
import Api from 'utils/Api'
import context from '../context'
import debounce from 'lodash/debounce'
import { useHistory } from 'react-router-dom'

export function useUser() {
  const [user, setUser] = useState()
  useEffect(() => {
    async function getUser() {
      const { user } = await Api.getUserInfo()
      setUser(user)
    }
    getUser()
  }, [])
  return user
}

const blacklist = ['holiday@group', 'contacts@group', 'weeknum@group']
export function useGoogleCalendars(token) {
  const [calendars, setCalendars] = useState([])
  useEffect(() => {
    if (!token) return
    Api.getCalendarList(token).then(({ items }) => setCalendars(items))
  }, [token])
  return (calendars || []).filter(
    ({ id }) => !blacklist.some(v => id.includes(v))
  )
}

export function useScrollAtTop() {
  const [atTop, setAtTop] = useState(window.scrollY === 0)

  useEffect(() => {
    function handleScrollStart() {
      setAtTop(false)
      window.addEventListener('scroll', handleScrollStop, { passive: true })
    }

    const handleScrollStop = debounce(
      () => {
        if (window.scrollY !== 0) return
        setAtTop(true)
        window.removeEventListener('scroll', handleScrollStop)
        window.addEventListener('scroll', handleScrollStart, {
          passive: true,
          once: true,
        })
      },
      100,
      { leading: false, trailing: true }
    )

    window.addEventListener('scroll', handleScrollStart, {
      passive: true,
      once: true,
    })
    return () =>
      window.removeEventListener(
        'scroll',
        window.scrollY === 0 ? handleScrollStart : handleScrollStop
      )
  }, [])

  return atTop
}

export const useCtx = () => useContext(context)

export { useHistory }
