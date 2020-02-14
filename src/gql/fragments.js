import gql from 'graphql-tag'

export default {
  landingPage: {
    mentor: gql`
      fragment LandingPageMentor on Mentor {
        _id
        name
        keycode
        role
        company
        bio
        profilePictures {
          size
          type
          url
        }
      }
    `,
  },
}
