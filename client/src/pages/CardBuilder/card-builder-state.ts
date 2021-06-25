import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import { templateNames } from 'src/templates'
import { FileItem } from 'src/types/files'
import {
  // CardSpecBaseType,
  CardBuilderStep,
  CardBuilderSubmissionError,
  CheckoutFormData,
  OrderQuantityOption,
  TemplateID,
} from './types'

export type CardBuilderState = {
  // If we come back to Card Builder, from say Stripe Checkout, we
  // will have already created an order and can avoid creating a new one
  // on the next "Submit"
  previousOrder?: string

  currentStep: CardBuilderStep

  baseType: CardSpecBaseType
  quantity: OrderQuantityOption | null
  checkoutFormData: CheckoutFormData
  cardVersionId: string | null

  // Template details
  templateId: TemplateID | null
  templateCustomization: Record<string, any> | null
  omittedOptionalFields: Array<string>

  // Custom details
  frontDesignFile: FileItem | null
  backDesignFile: FileItem | null

  submissionError?: CardBuilderSubmissionError | null
}

const createInitialState = (baseType: CardSpecBaseType): CardBuilderState => ({
  currentStep: ({
    [CardSpecBaseType.Custom]: 'build',
    [CardSpecBaseType.Template]: 'base',
  } as const)[baseType],
  baseType,
  quantity: 100,
  cardVersionId: null,
  templateId: ({
    [CardSpecBaseType.Custom]: null,
    [CardSpecBaseType.Template]: templateNames[0],
  } as const)[baseType],
  frontDesignFile: null,
  backDesignFile: null,
  checkoutFormData: {
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
  },
  templateCustomization: null,
  omittedOptionalFields: [],
})

export const initialStateOptions: Record<CardSpecBaseType, CardBuilderState> = {
  [CardSpecBaseType.Custom]: createInitialState(CardSpecBaseType.Custom),
  [CardSpecBaseType.Template]: createInitialState(CardSpecBaseType.Template),
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
