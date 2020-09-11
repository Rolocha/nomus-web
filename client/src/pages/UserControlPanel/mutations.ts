import { gql } from 'src/apollo'

export const CHANGE_ACTIVE_CARD_VERSION = gql`
  mutation ChangeActiveCardVersion($cardVersionId: String!) {
    changeActiveCardVersion(cardVersionId: $cardVersionId) {
      id
      defaultCardVersion {
        id
        createdAt
        frontImageUrl
        backImageUrl
      }
    }
  }
`
