import { gql } from 'src/apollo'

export default gql`
  mutation SubmitCustomOrderMutation($payload: SubmitCustomOrderInput!) {
    submitCustomOrder(payload: $payload) {
      clientSecret
      orderId
    }
  }
`
