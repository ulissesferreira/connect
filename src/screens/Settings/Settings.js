import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import AppContext from '../../components/AppContext'
import Profile from './Profile'
import SettingsAccountTab from '../../components/SettingsAccountTab'
import CalendarTab from './CalendarTab'
import Navigation from './Navigation'
import { Route, Switch } from 'react-router-dom'
import styles from './Settings.module.scss'

export default function Settings() {
  const ctx = useContext(AppContext)
  if (!ctx.loggedIn) return null

  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Upframe</title>
        <meta property="og:title" content="Settings | Upframe"></meta>
        <meta
          property="og:description"
          content="Change your profile information and settings"
        ></meta>
        <meta property="og:image" content="/android-chrome-192x192.png"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Helmet>
      <main id="settings" className={styles.settings}>
        <Navigation />
        <div className={styles.rightColumn}>
          <Switch>
            <Route path="/settings/public" component={Profile} />
            <Route path="/settings/account" component={SettingsAccountTab} />
            <Route path="/settings/sync" component={CalendarTab} />
          </Switch>
        </div>
      </main>
    </React.Fragment>
  )
}
