import { gql } from 'src/apollo'

export default gql`
  mutation UpsertCustomOrderMutation($payload: UpsertCustomOrderInput!) {
    upsertCustomOrder(payload: $payload) {
      clientSecret
      orderId
    }
  }
`
