import React from 'react'
import styles from './profile.module.scss'
import {
  Card,
  ProfilePicture,
  Icon,
  SocialIcon,
  Title,
  Chip,
  Markdown,
} from '../../components'

export default function Showcase({ user }) {
  return (
    <Card className={styles.showcase}>
      <div className={styles.leftColumn}>
        <ProfilePicture imgs={user.profilePictures} size="13rem" />
        <p className={styles.name}>{user.name}</p>
        <p className={styles.role}>{user.headline}</p>
        {user.location && (
          <p className={styles.location}>
            <Icon icon="location" />
            {user.location}
          </p>
        )}
        <div className={styles.social}>
          {(user.social || []).map(({ name, url, handle }) => (
            <SocialIcon
              key={name}
              link={url + handle}
              {...{ [name.toLowerCase()]: true }}
            />
          ))}
        </div>
      </div>
      <div className={styles.rightColumn}>
        <Title size={3}>About me</Title>
        {user.biography &&
          user.biography
            .split('\n')
            .map((v, i) => <Markdown key={`biography${i}`} text={v} />)}
        {user.role !== 'USER' && Array.isArray(user.tags) && (
          <>
            <Title size={3}>I can advise you on</Title>
            <div className={styles.skills}>
              {user.tags.map(({ id, name }) => (
                <Chip key={id} removable={false}>
                  {name}
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
