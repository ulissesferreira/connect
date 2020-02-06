import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './dropdown.module.scss'

export default function Dropdown({ ctx, onBlur }) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    ref.current.focus()
  }, [ref])

  return (
    <nav
      className={styles.dropdown}
      tabIndex={0}
      ref={ref}
      onBlur={() => setTimeout(onBlur, 100)}
    >
      <Link to={`/${ctx.user.keycode}`}>My Profile</Link>
      <Link to={`/settings/public`}>Settings</Link>
      <p onClick={ctx.logout}>Sign out</p>
    </nav>
  )
}