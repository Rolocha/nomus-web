import { PaymentIntent, Token } from '@stripe/stripe-js'
import {
  CardBuilderStep,
  BaseType,
  OrderQuantityOption,
  CheckoutFormData,
  TemplateID,
} from './types'
import { FileItem } from 'src/types/files'

export type CardBuilderState = {
  currentStep: CardBuilderStep

  baseType: BaseType
  quantity: OrderQuantityOption | null
  formData: CheckoutFormData

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
  formData: {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  },
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
