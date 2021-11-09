import { useMutation } from 'src/apollo'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import {
  SubmitCustomOrderMutation,
  SubmitCustomOrderMutationVariables,
} from 'src/apollo/types/SubmitCustomOrderMutation'
import {
  SubmitTemplateOrderMutation,
  SubmitTemplateOrderMutationVariables,
} from 'src/apollo/types/SubmitTemplateOrderMutation'
import {
  CardBuilderState,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import {
  SUBMIT_CUSTOM_ORDER_MUTATION,
  SUBMIT_TEMPLATE_ORDER_MUTATION,
} from 'src/pages/CardBuilder/mutations'
import { colors } from 'src/styles'
import templateLibrary from 'src/templates'
import {
  dataURItoBlob,
  getImageDimensions,
  ImageDimensions,
} from 'src/utils/image'

export const sampleCardBuilderState: CardBuilderState = {
  ...initialStateOptions[CardSpecBaseType.Template],
  cardVersionId: 'cardv_1234',
  baseType: CardSpecBaseType.Template,
  templateId: 'konawide',
  templateCustomization: {
    contactInfo: {
      name: 'Spongebob Squarepants',
      headline: 'Fry Cook at the Krusty Krab',
      line1: 'The Krusty Krab',
      line2: '(555)-555-5555',
      line3: '(555)-555-5555',
      line4: '(555)-555-5555',
      footer: "I'm ready, I'm ready, I'm ready",
    },
    graphic: {
      file: {
        url:
          'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
      },
      size: 1,
    },
    colorScheme: {
      background: colors.offWhite,
      accent: colors.gold,
      accent2: colors.nomusBlue,
      text: colors.midnightGray,
    },
  },
  quantity: 100,
  // ============ UNCOMMENT THESE LINES TO RENDER A SUBMISSION ERROR
  // submissionError: {
  //   message: 'The security code you entered is incorrect.',
  //   backlinkToStep: 'checkout',
  // },
}

type UseSubmitOrderResponse = {
  checkoutSession: string
} | null
export const useSubmitOrder = () => {
  const [submitCustomOrder] = useMutation<SubmitCustomOrderMutation>(
    SUBMIT_CUSTOM_ORDER_MUTATION,
  )
  const [submitTemplateOrder] = useMutation<SubmitTemplateOrderMutation>(
    SUBMIT_TEMPLATE_ORDER_MUTATION,
  )

  const submit = async (cardBuilderState: CardBuilderState) => {
    const { quantity, orderId } = cardBuilderState
    if (quantity == null) {
      throw new Error('Missing quantity')
    }
    if (orderId == null) {
      throw new Error('Missing orderId')
    }

    // The parameters needed for both custom and template-based orders
    const basePayload:
      | Partial<SubmitCustomOrderMutationVariables['payload']>
      | Partial<SubmitTemplateOrderMutationVariables['payload']> = {
      orderId,
      quantity,
    }

    let result = null
    switch (cardBuilderState.baseType) {
      case CardSpecBaseType.Custom:
        const customResult = await submitCustomOrder({
          variables: {
            payload: {
              ...basePayload,
              frontImageDataUrl: cardBuilderState.frontDesignFile?.file,
              backImageDataUrl: cardBuilderState.backDesignFile?.file,
            },
          },
        })
        if (customResult.errors || !customResult.data) {
          throw new Error('Failed to submit template order')
        }
        result = customResult.data.submitCustomOrder
        break
      case CardSpecBaseType.Template:
        const { templateId } = cardBuilderState
        if (!templateId) {
          throw new Error(
            'Sumbitting a template order without a templateId defined',
          )
        }

        const template = templateLibrary[templateId]
        const cardImageDataUrls = await template.renderBothSidesToDataUrls(
          template.createOptionsFromFormFields(
            cardBuilderState.templateCustomization!,
            cardBuilderState.omittedOptionalFields as any[],
          ),
        )

        const templateSpecificRequiredPayload = {
          templateId: cardBuilderState.templateId,
          cardVersionId: cardBuilderState.cardVersionId,
          colorScheme: cardBuilderState.templateCustomization?.colorScheme,
          contactInfo: cardBuilderState.templateCustomization?.contactInfo,
          qrCodeUrl: cardBuilderState.templateCustomization?.qrCodeUrl,
          frontImageDataUrl: dataURItoBlob(cardImageDataUrls.front),
          backImageDataUrl: dataURItoBlob(cardImageDataUrls.back),
        }

        const templateSpecificOptionalPayload = {
          graphic: cardBuilderState.templateCustomization?.graphic?.file,
        }

        const templateSpecificPayload = {
          ...templateSpecificRequiredPayload,
          ...templateSpecificOptionalPayload,
        }

        if (!Object.values(templateSpecificRequiredPayload).every(Boolean)) {
          throw new Error('Missing required fields')
        }

        const templateResult = await submitTemplateOrder({
          variables: {
            payload: {
              ...basePayload,
              ...templateSpecificPayload,
            },
          },
        })
        if (templateResult.errors || !templateResult.data) {
          throw new Error('Failed to submit template order')
        }
        result = templateResult.data.submitTemplateOrder
        break
      default:
        throw new Error('Submitted Card Builder with invalid base type')
    }
    return result as UseSubmitOrderResponse
  }

  return submit
}

export type CustomImagesValidationResult = {
  frontSizeCorrect: boolean
  backSizeCorrect: boolean
  sizesMatch: boolean
  frontDimensions: ImageDimensions | null
  backDimensions: ImageDimensions | null
}

export const validateCustomImages = async (
  frontImage?: string,
  backImage?: string,
): Promise<CustomImagesValidationResult> => {
  const frontDimensions = frontImage
    ? await getImageDimensions(frontImage)
    : null
  const backDimensions = backImage ? await getImageDimensions(backImage) : null

  const result: CustomImagesValidationResult = {
    frontSizeCorrect: false,
    backSizeCorrect: false,
    sizesMatch: true,
    frontDimensions,
    backDimensions,
  }

  // If both are present, check that they match first
  if (frontDimensions && backDimensions) {
    const mismatched =
      frontDimensions.height !== backDimensions.height ||
      frontDimensions.width !== backDimensions.width
    if (mismatched) {
      result.sizesMatch = false
    }
  }

  const [frontDimensionsOkay, backDimensionsOkay] = [
    frontDimensions,
    backDimensions,
  ].map((dims) => {
    if (!dims) return true
    const aspectRatio =
      Math.max(dims.height, dims.width) / Math.min(dims.height, dims.width)
    const isAcceptableAspectRatio = aspectRatio > 1.7 && aspectRatio < 1.8
    return isAcceptableAspectRatio
  })

  result.frontSizeCorrect = frontDimensionsOkay
  result.backSizeCorrect = backDimensionsOkay

  return result
}
