import gql from 'graphql-tag'
import { person } from './fragments'

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`

export const SET_PROFILE_VISIBILITY = gql`
  mutation SetProfileVisibility($visibility: Visibility!) {
    setProfileVisibility(visibility: $visibility) {
      id
      searchable
      ... on Mentor {
        visibility
      }
    }
  }
`

export const SET_PROFILE_SEARCHABILITY = gql`
  mutation SetProfileSearchability($searchable: Boolean!) {
    setProfileSearchability(searchable: $searchable) {
      ...PersonBase
      searchable
      ... on Mentor {
        visibility
      }
    }
  }
  ${person.base}
`

export const REQUEST_EMAIL_CHANGE = gql`
  mutation RequestEmailChange($email: String!) {
    requestEmailChange(email: $email)
  }
`

export const REQUEST_PASSWORD_CHANGE = gql`
  mutation RequestPasswordChange($email: String!) {
    requestPasswordChange(email: $email)
  }
`

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($handle: String!) {
    deleteAccount(handle: $handle)
  }
`

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($diff: ProfileInput!) {
    updateProfile(input: $diff) {
      ...ProfileSettings
    }
  }
  ${person.profileSettings}
`

export const SET_TIMEZONE = gql`
  mutation SetTimezone($tz: String!) {
    setTimezone(tz: $tz) {
      ...ProfileSettings
    }
  }
  ${person.profileSettings}
`

export const SET_INFER_TZ = gql`
  mutation SetInferTz($infer: Boolean!) {
    setInferTz(infer: $infer) {
      ...ProfileSettings
    }
  }
  ${person.profileSettings}
`

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation UploadProfilePicture($file: Upload!) {
    uploadProfilePicture(file: $file) {
      ...PersonBase
    }
  }
  ${person.base}
`

export const REMOVE_PROFILE_PICTURE = gql`
  mutation RemoveProfilePicture {
    removeProfilePicture {
      ...PersonBase
    }
  }
  ${person.base}
`

export const UPDATE_NOTIICATION_PREFERENCES = gql`
  mutation UpdateNotificationSettings($diff: NotificationSettingsInput!) {
    updateNotificationPreferences(input: $diff) {
      ...PersonBase
      ... on User {
        notificationPrefs {
          receiveEmails
          msgEmails
        }
      }
      ... on Mentor {
        notificationPrefs {
          receiveEmails
          msgEmails
          slotReminder
        }
      }
    }
  }
  ${person.base}
`

export const UPDATE_SLOTS = gql`
  mutation UpdateSlots($added: [SlotInput!], $deleted: [ID!]) {
    updateSlots(slots: { added: $added, deleted: $deleted }) {
      id
      ... on Mentor {
        slots(includeBooked: true) {
          id
          start
          end
        }
      }
    }
  }
`

export const REQUEST_MEETUP = gql`
  mutation RequestMeetup($slotId: ID!, $msg: String!) {
    requestSlot(input: { slotId: $slotId, message: $msg })
  }
`

export const ACCEPT_MEETUP = gql`
  mutation AcceptMeetup($meetupId: ID!) {
    acceptMeetup(meetupId: $meetupId) {
      start
      location
      mentee {
        name
      }
    }
  }
`

export const CANCEL_MEETING = gql`
  mutation CancelMeetup($meetupId: ID!) {
    cancelMeetup(meetupId: $meetupId)
  }
`

export const CONNECT_CALENDAR = gql`
  mutation ConnectCalendar($code: ID!, $redirect: String!) {
    connectCalendar(code: $code, redirect: $redirect) {
      id
      ... on Mentor {
        calendarConnected
        calendars {
          id
          name
          color
        }
      }
    }
  }
`

export const DISCONNECT_CALENDAR = gql`
  mutation DisconnectCalendar {
    disconnectCalendar {
      id
      ... on Mentor {
        calendarConnected
      }
    }
  }
`

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($password: String!, $token: String) {
    changePassword(password: $password, token: $token) {
      ...PersonBase
      ... on Mentor {
        calendarConnected
      }
      google {
        connected
        email
        canDisconnect
      }
    }
  }
  ${person.base}
`

export const CHANGE_EMAIL = gql`
  mutation ChangeEmail($token: String!) {
    changeEmail(token: $token) {
      ...PersonBase
      ... on Mentor {
        calendarConnected
      }
    }
  }
  ${person.base}
`

export const CONNECT_GOOGLE = gql`
  mutation ConnectGoogle($code: ID!, $redirect: String!) {
    connectGoogle(code: $code, redirect: $redirect) {
      ...PersonBase
      google {
        connected
        email
        canDisconnect
      }
    }
  }
  ${person.base}
`

export const DISCONNECT_GOOGLE = gql`
  mutation DisconnectGoogle {
    disconnectGoogle {
      ...PersonBase
      google {
        connected
        email
        canDisconnect
      }
    }
  }
  ${person.base}
`
