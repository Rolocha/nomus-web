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
  cardVersionId: string | null
  templateId: TemplateID | null
  templateCustomization: Record<string, any> | null
  omittedOptionalFields: Array<string>

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
    [BaseType.Custom]: 'build',
    [BaseType.Template]: 'base',
  } as const)[baseType],
  baseType,
  quantity: 100,
  cardVersionId: null,
  templateId: ({
    [BaseType.Custom]: null,
    [BaseType.Template]: templateNames[0],
  } as const)[baseType],
  frontDesignFile: null,
  backDesignFile: null,
  formData: {
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  templateCustomization: null,
  omittedOptionalFields: [],
  stripeToken: null,
  paymentIntent: null,
  cardEntryComplete: false,
})

export const initialStateOptions: Record<BaseType, CardBuilderState> = {
  [BaseType.Custom]: createInitialState(BaseType.Custom),
  [BaseType.Template]: createInitialState(BaseType.Template),
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
