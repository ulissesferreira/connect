import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Api from '../../utils/Api'
import { Breadcrumbs, RecommendationCard } from '../../components'
import styles from './profile.module.scss'
import Showcase from './Showcase'
import Meetup from './Meetup'
import Request from './Request'
import recommend from '../common/recommendationList'

export default function Profile({ match }) {
  const [mentor, setMentor] = useState()
  const [exists, setExists] = useState(true)
  const [showRequest, toggleRequest] = useState(false)

  useEffect(() => {
    Api.getMentorInfo(match.params.keycode).then(({ ok, mentor }) => {
      if (!ok) setExists(false)
      else setMentor(mentor)
    })
  }, [match.params.keycode])

  if (!exists) return <Redirect to="/404" />
  if (!mentor) return <div>loading...</div>
  return (
    <main className={styles.profile}>
      <Breadcrumbs name={mentor.name} />
      <Showcase mentor={mentor} />
      <Meetup
        mentor={mentor}
        onSlot={toggleRequest}
        onMsg={() => toggleRequest(true)}
      />
      {showRequest && (
        <Request
          mentor={mentor}
          {...(typeof showRequest === 'string' && { slot: showRequest })}
          onClose={() => toggleRequest(false)}
        />
      )}
      {mentor.keycode in recommend && (
        <RecommendationCard recommendations={recommend[`${mentor.keycode}`]} />
      )}
    </main>
  )
}