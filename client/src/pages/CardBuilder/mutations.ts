import { gql } from 'src/apollo'

export const SUBMIT_CUSTOM_ORDER_MUTATION = gql`
  mutation SubmitCustomOrderMutation($payload: SubmitCustomOrderInput!) {
    submitCustomOrder(payload: $payload) {
      orderId
      checkoutSession
    }
  }
`

export const SUBMIT_TEMPLATE_ORDER_MUTATION = gql`
  mutation SubmitTemplateOrderMutation($payload: SubmitTemplateOrderInput!) {
    submitTemplateOrder(payload: $payload) {
      orderId
      checkoutSession
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

export const LOAD_EXISTING_CARD_BUILDER_ORDER = gql`
  query LoadExistingCardBuilderOrder($orderId: String!) {
    order(orderId: $orderId) {
      id
      quantity
      shippingName
      shippingAddress {
        line1
        line2
        city
        state
        postalCode
      }

      user {
        name {
          first
          middle
          last
        }
      }

      cardVersion {
        id
        baseType
        frontImageUrl
        backImageUrl
        qrCodeUrl

        templateId
        contactInfo {
          name
          line1
          line2
          line3
          line4
          headline
          footer
        }
        colorScheme {
          background
          text
          accent
          accent2
          accent3
          accent4
        }
      }
    }
  }
`
