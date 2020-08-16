import { gql } from 'src/apollo'

export default gql`
  mutation CreateCustomOrderMutation($payload: CreateCustomOrderInput!) {
    createCustomOrder(payload: $payload) {
      clientSecret
      orderId
    }
  }
`
