import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import { LoadExistingCardBuilderOrder } from 'src/apollo/types/LoadExistingCardBuilderOrder'
import { getAllOmittedContactFields } from 'src/templates/utils'
import { templateNames } from 'src/templates'
import { TemplateID } from 'src/templates/types'
import { isValidTemplateID } from 'src/templates/utils'
import { FileItem } from 'src/types/files'
import { imageUrlToFile } from 'src/utils/image'
import { CardBuilderStep, CardBuilderSubmissionError } from './types'
import { CardQuantityOption } from 'src/utils/pricing'

export type CardBuilderState = {
  // Card builder metadata

  // If we come back to Card Builder, from say Stripe Checkout, we
  // will have already created an order and can avoid creating a new one
  // on the next "Submit"
  orderId: string | null
  cardVersionId: string | null
  currentStep: CardBuilderStep
  baseType: CardSpecBaseType
  submissionError?: CardBuilderSubmissionError | null
  quantity: CardQuantityOption | null

  // Template base type details
  templateId: TemplateID | null
  templateCustomization: Record<string, any> | null
  omittedOptionalFields: Array<string>

  // Custom base type details
  frontDesignFile: FileItem | null
  backDesignFile: FileItem | null
}

const createInitialState = (baseType: CardSpecBaseType): CardBuilderState => ({
  currentStep: ({
    [CardSpecBaseType.Custom]: 'build',
    [CardSpecBaseType.Template]: 'base',
  } as const)[baseType],
  baseType,
  quantity: 100,
  orderId: null,
  cardVersionId: null,
  templateId: ({
    [CardSpecBaseType.Custom]: null,
    [CardSpecBaseType.Template]: templateNames[0],
  } as const)[baseType],
  frontDesignFile: null,
  backDesignFile: null,
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
    orderId: order.id,
    ...(cv.baseType && { baseType: cv.baseType }),
    ...(order.quantity && {
      quantity: order.quantity as CardQuantityOption,
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
    ...(cv.templateId &&
      isValidTemplateID(cv.templateId) &&
      cv.contactInfo && {
        omittedOptionalFields: getAllOmittedContactFields(
          cv.templateId as TemplateID,
          cv.contactInfo! as Record<string, any>,
        ),
      }),

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
export interface CardBuilderLocationState {
  cardBuilderState?: CardBuilderState
}
