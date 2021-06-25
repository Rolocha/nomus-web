import { yupResolver } from '@hookform/resolvers/yup'
import { useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useLocation, useHistory, useParams } from 'react-router-dom'
import { useQuery, useMutation } from 'src/apollo'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import { InitializeCardBuilder } from 'src/apollo/types/InitializeCardBuilder'
import { LoadExistingCardBuilderOrder } from 'src/apollo/types/LoadExistingCardBuilderOrder'
import {
  SubmitCustomOrderMutation,
  SubmitCustomOrderMutationVariables,
} from 'src/apollo/types/SubmitCustomOrderMutation'
import {
  SubmitTemplateOrderMutation,
  SubmitTemplateOrderMutationVariables,
} from 'src/apollo/types/SubmitTemplateOrderMutation'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import Wizard, { WizardStep } from 'src/components/Wizard'
import BaseStep from 'src/pages/CardBuilder/BaseStep'
import {
  CardBuilderAction,
  cardBuilderReducer,
  CardBuilderState,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import CheckoutStep from 'src/pages/CardBuilder/CheckoutStep'
import CustomBuildStep from 'src/pages/CardBuilder/CustomBuildStep'
import CustomReviewStep from 'src/pages/CardBuilder/CustomReviewStep'
import {
  INITIALIZE_CARD_BUILDER_MUTATION,
  LOAD_EXISTING_CARD_BUILDER_ORDER,
  SUBMIT_CUSTOM_ORDER_MUTATION,
  SUBMIT_TEMPLATE_ORDER_MUTATION,
} from 'src/pages/CardBuilder/mutations'
import TemplateBuildStep from 'src/pages/CardBuilder/TemplateBuildStep'
import TemplateReviewStep from 'src/pages/CardBuilder/TemplateReviewStep'
import {
  CardBuilderStep,
  CheckoutFormData,
  OrderQuantityOption,
} from 'src/pages/CardBuilder/types'
import LoadingPage from 'src/pages/LoadingPage'
import breakpoints, { useBreakpoint } from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import templateLibrary, { TemplateID } from 'src/templates'
import { dataURItoBlob, imageUrlToFile } from 'src/utils/image'
import { isValidStateAbr } from 'src/utils/states'
import * as yup from 'yup'

interface ParamsType {
  buildBaseType?: 'custom' | 'template' | 'success' | 'cancel' | string
}

const bp = 'lg'

const CardBuilder = () => {
  const { buildBaseType: baseTypeQueryParam } = useParams<ParamsType>()
  const location = useLocation()
  const history = useHistory()
  const isDesktop = useBreakpoint('lg')

  const baseType =
    baseTypeQueryParam === 'custom' || baseTypeQueryParam === 'template'
      ? {
          custom: CardSpecBaseType.Custom,
          template: CardSpecBaseType.Template,
        }[baseTypeQueryParam]
      : null

  const [cardBuilderState, updateCardBuilderState] = React.useReducer(
    cardBuilderReducer,
    (() => {
      const initialState = baseType
        ? initialStateOptions[baseType]
        : initialStateOptions[CardSpecBaseType.Custom]

      const queryParams = new URLSearchParams(location.search)
      const prefillName = queryParams.get('prefillName')
      if (prefillName) {
        initialState.templateCustomization = {
          contactInfo: { name: prefillName },
        }
        initialState.checkoutFormData.name = prefillName
      }

      return initialState
    })(),
  )

  const [
    initializeCardBuilder,
    initializeCardBuilderMutationResult,
  ] = useMutation<InitializeCardBuilder>(INITIALIZE_CARD_BUILDER_MUTATION)

  const { refetch: loadExistingOrder } = useQuery<LoadExistingCardBuilderOrder>(
    LOAD_EXISTING_CARD_BUILDER_ORDER,
    {
      skip: true,
      variables: {
        orderId: new URLSearchParams(location.search).get('orderId') as string,
      },
    },
  )

  // Request an initialized CardVersion from the API
  // when the card builder loads so we can use its id
  // things like the QR code URL
  const initialize = React.useCallback(async () => {
    // If the user canceled the order from an external location (currently
    // this would just be Stripe Checkout), there should be an orderId query param
    // that we should use to load the card builder up with
    if (baseTypeQueryParam === 'cancel') {
      const searchParams = new URLSearchParams(location.search)
      const orderIdParam = searchParams.get('orderId')
      if (!orderIdParam) {
        return <Redirect to="/shop" />
      }
      const result = await loadExistingOrder({
        variables: {
          orderId: orderIdParam,
        },
      })

      const _order = result.data?.order
      if (!_order) {
        return <Redirect to="/shop" />
      }
      const _cv = _order.cardVersion

      const cardBuilderStateUpdate: Partial<CardBuilderState> = {
        currentStep: 'review',
        previousOrder: orderIdParam,
        ...(_cv.baseType && { baseType: _cv.baseType }),
        ...(_order.quantity && {
          quantity: _order.quantity as OrderQuantityOption,
        }),
        ...(_order.shippingAddress &&
          _order.shippingName && {
            checkoutFormData: {
              name: _order.shippingName,
              line1: _order.shippingAddress.line1,
              line2: _order.shippingAddress.line2 ?? '',
              city: _order.shippingAddress.city,
              state: _order.shippingAddress.state,
              postalCode: _order.shippingAddress.postalCode,
            },
          }),
        ...(_cv.id && { cardVersionId: _cv.id }),

        // Template-specific fields
        ...(_cv.templateId && { templateId: _cv.templateId as TemplateID }),
        ...(_cv.contactInfo &&
          _cv.colorScheme &&
          _cv.qrCodeUrl && {
            templateCustomization: {
              contactInfo: (({ __typename, ...rest }) => rest)(_cv.contactInfo),
              colorScheme: (({ __typename, ...rest }) => rest)(_cv.colorScheme),
              qrCodeUrl: _cv.qrCodeUrl,
            },
          }),
        omittedOptionalFields: [], // TODO: Figure out a way to autofill this properly

        // Custom-specific fields
        ...(_cv.frontImageUrl && {
          frontDesignFile: {
            file: await imageUrlToFile(_cv.frontImageUrl),
            url: _cv.frontImageUrl,
          },
        }),
        ...(_cv.backImageUrl && {
          backDesignFile: {
            file: await imageUrlToFile(_cv.backImageUrl),
            url: _cv.backImageUrl,
          },
        }),
      }

      updateCardBuilderState(cardBuilderStateUpdate)

      history.push(`/card-studio/${_cv.baseType.toLowerCase()}`)
    } else {
      if (initializeCardBuilderMutationResult.called) {
        return
      }

      const result = await initializeCardBuilder({
        variables: {
          baseType: cardBuilderState.baseType,
        },
      })
      if (result.errors) {
        console.log(result.errors)
        throw new Error('oh no!')
      }
      updateCardBuilderState({
        cardVersionId: result.data?.createEmptyCardVersion.id,
      })
    }
  }, [
    loadExistingOrder,
    location,
    history,
    baseTypeQueryParam,
    initializeCardBuilder,
    initializeCardBuilderMutationResult,
    cardBuilderState,
    updateCardBuilderState,
  ])

  React.useEffect(() => {
    initialize()
  }, [initialize])

  const checkoutFormMethods = useForm<CheckoutFormData>({
    defaultValues: cardBuilderState.checkoutFormData ?? undefined,
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        state: yup
          .string()
          .required('Required')
          .test('is-state', 'Invalid state', isValidStateAbr),
        postalCode: yup
          .string()
          .required('Required')
          .matches(/^\d{5}$/, 'Invalid ZIP code'),
      }),
    ),
  })

  const watchedFields = checkoutFormMethods.watch()

  const stripe = useStripe()
  const [submitCustomOrder] = useMutation<SubmitCustomOrderMutation>(
    SUBMIT_CUSTOM_ORDER_MUTATION,
  )
  const [submitTemplateOrder] = useMutation<SubmitTemplateOrderMutation>(
    SUBMIT_TEMPLATE_ORDER_MUTATION,
  )

  const submitOrder = React.useCallback(async () => {
    const {
      checkoutFormData: formData,
      quantity,
      previousOrder,
    } = cardBuilderState

    if (
      formData == null ||
      formData.name == null ||
      formData.line1 == null ||
      formData.city == null ||
      formData.state == null ||
      formData.postalCode == null
    ) {
      console.log('missing data')
      return
    }

    // The parameters needed for both custom and template-based orders
    const basePayload:
      | Partial<SubmitCustomOrderMutationVariables['payload']>
      | Partial<SubmitTemplateOrderMutationVariables['payload']> = {
      previousOrder,
      shippingName: formData?.name,
      shippingAddress: {
        line1: formData?.line1,
        line2: formData?.line2,
        city: formData?.city,
        state: formData?.state.toUpperCase(),
        postalCode: formData?.postalCode,
      },
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
        result = customResult.data?.submitCustomOrder
        break
      case CardSpecBaseType.Template:
        // Use <any, any> to appease TS for now. See TemplateCard.tsx for more details on why this is necessary.
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
          templateName: templateLibrary[templateId].name,
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
        result = templateResult.data?.submitTemplateOrder
        break
      default:
        throw new Error('Submitted Card Builder with invalid base type')
    }
    return result
  }, [cardBuilderState, submitCustomOrder, submitTemplateOrder])

  const handleWizardSubmit = React.useCallback(async () => {
    const submitOrderResult = await submitOrder()

    if (submitOrderResult == null) {
      throw new Error('Failed to create order, submitOrderResult was null')
    }

    // Order successfully created, redirect to Stripe Checkout so we can get that moola
    const result = await stripe?.redirectToCheckout({
      sessionId: submitOrderResult.checkoutSession,
    })
    if (result?.error) {
      updateCardBuilderState({
        submissionError: {
          message:
            result.error.message || 'Unknown error while loading checkout',
        },
      })
    }
  }, [submitOrder, stripe])

  // When the checkout form is mounted, the most up-to-date data comes from watchedFields
  // since the user may be editing the fields. On wizard step change, we cache the form data to
  // cardBuilderState before react-hook-form unmounts the input (and watchedFields becomes empty)
  // so if we're not on the checkout step, use that cache instead
  const formData =
    cardBuilderState.currentStep === 'checkout'
      ? watchedFields
      : cardBuilderState.checkoutFormData

  const handleWizardStepTransition = async (_goingToStep: string) => {
    const comingFromStep = cardBuilderState.currentStep
    const goingToStep = _goingToStep as CardBuilderStep

    // We need to update the cardBuilderState.currentStep at the end of
    // the transition process but the process itself may require other
    // state updates. We queue up all those updates in this object and apply it
    // at the end of this method call.
    const cardBuilderStateUpdate: CardBuilderAction = {
      currentStep: goingToStep,
    }

    // (base) => build => checkout => review
    switch (comingFromStep) {
      case 'build':
        if (baseType === CardSpecBaseType.Template) {
          // If the user leaves the template build step with any contact info fields not yet explicitly omitted
          // but also not filled in, implicitly mark the fields as omitted
          if (!cardBuilderState.templateId) break
          const selectedTemplate = templateLibrary[cardBuilderState.templateId]

          const fieldsLeftEmptyButForgotToOmit = selectedTemplate.contactInfoFieldNames.filter(
            (contactInfoFieldName) =>
              !cardBuilderState.templateCustomization?.contactInfo[
                contactInfoFieldName
              ],
          )

          updateCardBuilderState({
            omittedOptionalFields: fieldsLeftEmptyButForgotToOmit.map(
              (fieldName) => `contactInfo.${fieldName}`,
            ),
          })
        }
        break
      case 'checkout':
        // Cache the current form data in cardBuilderState since react-hook-form
        // will drop it when the form fields unmount
        cardBuilderStateUpdate.checkoutFormData = checkoutFormMethods.getValues()
        break
      default:
        break
    }

    updateCardBuilderState(cardBuilderStateUpdate)
  }

  if (baseTypeQueryParam === 'success' || baseTypeQueryParam === 'cancel') {
    return <LoadingPage />
  } else if (!baseType) {
    // If user goes straight to `/card-studio` or `/card-studio/adsdfsaf`, redirect them to the shop front
    return <Redirect to="/shop" />
  }

  return (
    <Box
      bg={theme.colors.ivory}
      minHeight={{ [bp]: '100vh' }}
      minWidth={{ base: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      width="100%"
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar />
      <Box
        container={isDesktop}
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
      >
        <Box
          maxWidth={{ [bp]: `calc(1.5 * ${breakpoints.lg})` }}
          display="flex"
          flexDirection="column"
        >
          <Box mt={4} mb="24px" display={{ base: 'none', [bp]: 'block' }}>
            <Text.PageHeader>
              {
                {
                  [CardSpecBaseType.Custom]:
                    'Build a card with your own design',
                  [CardSpecBaseType.Template]: 'Build a card from a template',
                }[baseType]
              }
            </Text.PageHeader>
          </Box>
          <Wizard
            completionButtonLabel="Submit order"
            currentStep={cardBuilderState.currentStep}
            handleStepTransition={handleWizardStepTransition}
            handleSubmit={handleWizardSubmit}
          >
            {baseType === CardSpecBaseType.Template && (
              <WizardStep
                id="base"
                icon="stack"
                label="Base"
                isReadyForNextStep={
                  {
                    [CardSpecBaseType.Custom]: true,
                    // For template base type, the template must have been chosen
                    [CardSpecBaseType.Template]:
                      cardBuilderState.templateId != null,
                  }[cardBuilderState.baseType]
                }
              >
                <BaseStep
                  selectedBaseType={baseTypeQueryParam}
                  cardBuilderState={cardBuilderState}
                  updateCardBuilderState={updateCardBuilderState}
                />
              </WizardStep>
            )}
            <WizardStep
              id="build"
              icon="formatText"
              label="Build"
              isReadyForNextStep={
                {
                  // For custom base type, at least the front design file must have been provided
                  [CardSpecBaseType.Custom]:
                    cardBuilderState.frontDesignFile != null,
                  // TBD requirements for template
                  [CardSpecBaseType.Template]:
                    cardBuilderState.templateId != null &&
                    templateLibrary[cardBuilderState.templateId].isComplete,
                }[cardBuilderState.baseType]
              }
            >
              {
                {
                  [CardSpecBaseType.Custom]: (
                    <CustomBuildStep
                      cardBuilderState={cardBuilderState}
                      updateCardBuilderState={updateCardBuilderState}
                    />
                  ),
                  [CardSpecBaseType.Template]: (
                    <TemplateBuildStep
                      cardBuilderState={cardBuilderState}
                      updateCardBuilderState={updateCardBuilderState}
                    />
                  ),
                }[cardBuilderState.baseType]
              }
            </WizardStep>
            <WizardStep
              id="checkout"
              icon="cart"
              label="Checkout"
              isReadyForNextStep={[
                formData.line1,
                formData.state,
                formData.city,
                formData.postalCode,
                formData.name,
                // If the current step isn't build, formState won't be valid since the form
                // isn't mounted so we trust that it's valid since we were able to get off
                // the build step in the first place
                cardBuilderState.currentStep !== 'build' ||
                  checkoutFormMethods.formState.isValid,
              ].every(Boolean)}
            >
              <CheckoutStep
                cardBuilderState={cardBuilderState}
                updateCardBuilderState={updateCardBuilderState}
                checkoutFormMethods={checkoutFormMethods}
              />
            </WizardStep>
            <WizardStep id="review" icon="checkO" label="Review">
              {
                {
                  [CardSpecBaseType.Custom]: (
                    <CustomReviewStep
                      cardBuilderState={cardBuilderState}
                      updateCardBuilderState={updateCardBuilderState}
                    />
                  ),
                  [CardSpecBaseType.Template]: (
                    <TemplateReviewStep
                      cardBuilderState={cardBuilderState}
                      updateCardBuilderState={updateCardBuilderState}
                    />
                  ),
                }[cardBuilderState.baseType]
              }
            </WizardStep>
          </Wizard>
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
