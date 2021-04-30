import { PaymentIntent, Token } from '@stripe/stripe-js'
import { templateNames } from 'src/templates'
import { FileItem } from 'src/types/files'
import {
  BaseType,
  CardBuilderStep,
  CheckoutFormData,
  OrderQuantityOption,
  TemplateID,
} from './types'

export type CardBuilderState = {
  currentStep: CardBuilderStep

  baseType: BaseType
  quantity: OrderQuantityOption | null
  formData: CheckoutFormData

  // Template details
  templateId: TemplateID | null
  graphicElementFile: FileItem | null
  templateCustomization: Record<string, any> | null

  // Custom details
  frontDesignFile: FileItem | null
  backDesignFile: FileItem | null

  // Card/payment details
  cardEntryComplete: boolean
  stripeToken: Token | null
  paymentIntent: PaymentIntent | null
}

const createInitialState = (baseType: BaseType): CardBuilderState => ({
  currentStep: ({
    custom: 'build',
    template: 'base',
  } as const)[baseType],
  baseType,
  quantity: 50,
  templateId: ({
    custom: null,
    template: templateNames[0],
  } as const)[baseType],
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
  templateCustomization: null,
  stripeToken: null,
  paymentIntent: null,
  cardEntryComplete: false,
})

export const initialStateOptions: Record<BaseType, CardBuilderState> = {
  custom: createInitialState('custom'),
  template: createInitialState('template'),
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
