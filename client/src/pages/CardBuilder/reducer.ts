import { PaymentIntent, Token } from '@stripe/stripe-js'
import { FileItem } from 'src/types/files'

export type TemplateID = 'foobar'

export type BaseType = 'custom' | 'template'

export type CardBuilderStep =
  | 'base'
  | 'build'
  | 'review'
  | 'checkout'
  | 'complete'

export type OrderQuantityOption = 25 | 50 | 100

// Data from the order details form
export interface CheckoutFormData {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
}

export type CardBuilderState = {
  currentStep: CardBuilderStep

  baseType: BaseType
  quantity: OrderQuantityOption | null
  formData: CheckoutFormData | null

  // Template details
  templateId: TemplateID | null
  graphicElementFile: FileItem | null

  // Custom details
  frontDesignFile: FileItem | null
  backDesignFile: FileItem | null

  // Card/payment details
  cardEntryComplete: boolean
  stripeToken: Token | null
  paymentIntent: PaymentIntent | null
}

export const initialState: CardBuilderState = {
  currentStep: 'build',
  baseType: 'custom',
  quantity: 50,
  templateId: null,
  frontDesignFile: null,
  backDesignFile: null,
  graphicElementFile: null,
  formData: null,
  stripeToken: null,
  paymentIntent: null,
  cardEntryComplete: false,
}

export type CardBuilderAction = Partial<CardBuilderState>

export const cardBuilderReducer = (
  state: CardBuilderState,
  action: CardBuilderAction,
): CardBuilderState => {
  return {
    ...state,
    ...action,
  }
}
