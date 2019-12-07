import React, { useContext, useState } from 'react'
import AppContext from 'components/AppContext'
import { Title, Text, Checkbox } from 'components'
import GoogleSync from './GoogleSync'
import { classes } from 'utils/css'
import styles from './calendarList.module.scss'

export default function CalendarList({ onChange, gCals }) {
  const ctx = useContext(AppContext)
  const isSynced = ctx.user && ctx.user.googleAccessToken
  const [selection, setSelection] = useState([])

  function toggleCalendar(name, v) {
    if (v === undefined) v = !selection.includes(name)
    const select = v ? [...selection, name] : selection.filter(n => n !== name)
    setSelection(select)
    onChange(select)
  }

  return (
    <div className={styles.wrap}>
      <div
        className={classes(styles.calendarList, { [styles.synced]: isSynced })}
      >
        {isSynced && (
          <>
            <Title s3>Calendars</Title>
            <div className={styles.list}>
              {gCals.map(({ summary }, i) => (
                <div
                  className={styles.calendarToggle}
                  key={
                    summary +
                    (gCals.findIndex(({ summary: v }) => v === summary) !== i
                      ? i
                      : '')
                  }
                >
                  <Checkbox
                    onChange={({ currentTarget }) =>
                      toggleCalendar(summary, currentTarget.checked)
                    }
                  />
                  <Text small strong>
                    {summary}
                  </Text>
                </div>
              ))}
            </div>
          </>
        )}
        {!isSynced && (
          <>
            <Title s3>Connect your Google&nbsp;Calendar</Title>
            <Text strong small mark>
              Scheduled events are added instantly to your calendar.
            </Text>
            <Text strong small>
              Check your availability before adding free slots.
            </Text>
            <GoogleSync />
          </>
        )}
      </div>
    </div>
  )
}
