import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import { LoadExistingCardBuilderOrder } from 'src/apollo/types/LoadExistingCardBuilderOrder'
import { templateNames } from 'src/templates'
import { FileItem } from 'src/types/files'
import { imageUrlToFile } from 'src/utils/image'
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

export const createCardBuilderStateFromExistingOrder = async (
  order: NonNullable<LoadExistingCardBuilderOrder['order']>,
): Promise<CardBuilderState> => {
  const cv = order.cardVersion
  return {
    ...initialStateOptions[order.cardVersion.baseType],
    currentStep: 'review',
    previousOrder: order.id,
    ...(cv.baseType && { baseType: cv.baseType }),
    ...(order.quantity && {
      quantity: order.quantity as OrderQuantityOption,
    }),
    ...(order.shippingAddress &&
      order.shippingName && {
        checkoutFormData: {
          name: order.shippingName,
          line1: order.shippingAddress.line1,
          line2: order.shippingAddress.line2 ?? '',
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          postalCode: order.shippingAddress.postalCode,
        },
      }),
    ...(cv.id && { cardVersionId: cv.id }),

    // Template-specific fields
    ...(cv.templateId && { templateId: cv.templateId as TemplateID }),
    ...(cv.contactInfo &&
      cv.colorScheme &&
      cv.qrCodeUrl && {
        templateCustomization: {
          contactInfo: (({ __typename, ...rest }) => rest)(cv.contactInfo),
          colorScheme: (({ __typename, ...rest }) => rest)(cv.colorScheme),
          qrCodeUrl: cv.qrCodeUrl,
        },
      }),
    omittedOptionalFields: [], // TODO: Figure out a way to autofill this properly

    // Custom-specific fields
    ...(cv.frontImageUrl && {
      frontDesignFile: {
        file: await imageUrlToFile(cv.frontImageUrl),
        url: cv.frontImageUrl,
      },
    }),
    ...(cv.backImageUrl && {
      backDesignFile: {
        file: await imageUrlToFile(cv.backImageUrl),
        url: cv.backImageUrl,
      },
    }),
  }
}

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
