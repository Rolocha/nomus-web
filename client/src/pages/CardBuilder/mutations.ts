import { gql } from 'src/apollo'

export const SUBMIT_CUSTOM_ORDER_MUTATION = gql`
  mutation SubmitCustomOrderMutation($payload: SubmitCustomOrderInput!) {
    submitCustomOrder(payload: $payload) {
      clientSecret
      orderId
    }
  }
`

export const SUBMIT_TEMPLATE_ORDER_MUTATION = gql`
  mutation SubmitTemplateOrderMutation($payload: SubmitTemplateOrderInput!) {
    submitTemplateOrder(payload: $payload) {
      clientSecret
      orderId
    }
  }
`

export const INITIALIZE_CARD_BUILDER_MUTATION = gql`
  mutation InitializeCardBuilder($baseType: CardSpecBaseType!) {
    createEmptyCardVersion(baseType: $baseType) {
      id
    }
  }
`
