import { useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'
import * as Sentry from '@sentry/react'
import {
  Prompt,
  Redirect,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom'
import { useMutation, useQuery } from 'src/apollo'
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
  createCardBuilderStateFromExistingOrder,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
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
import { CardBuilderStep } from 'src/pages/CardBuilder/types'
import { getAllOmittedContactFields } from 'src/templates/utils'
import LoadingPage from 'src/pages/LoadingPage'
import breakpoints, { useBreakpoint } from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import templateLibrary from 'src/templates'
import { dataURItoBlob } from 'src/utils/image'

interface ParamsType {
  buildBaseType?: 'custom' | 'template' | 'success' | 'cancel' | string
}

const SURE_YOU_WANT_LEAVE_MESSAGE =
  "Are you sure you want to leave? You'll lose the information you've entered so far."
const bp = 'lg'

const CardBuilder = () => {
  const { buildBaseType: baseTypeQueryParam } = useParams<ParamsType>()
  const location = useLocation()
  const history = useHistory()
  const isDesktop = useBreakpoint('lg')
  const orderIdSearchParam = new URLSearchParams(location.search).get('orderId')

  const [fatalError, setFatalError] = React.useState<string | null>(null)
  const [isNotSafeToRedirect, setIsNotSafeToRedirect] = React.useState(true)

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
      }

      return initialState
    })(),
  )

  const [
    initializeCardBuilder,
    initializeCardBuilderMutationResult,
  ] = useMutation<InitializeCardBuilder>(INITIALIZE_CARD_BUILDER_MUTATION)

  const {
    data: existingOrderData,
    ...loadExistingOrderQuery
  } = useQuery<LoadExistingCardBuilderOrder>(LOAD_EXISTING_CARD_BUILDER_ORDER, {
    skip: !orderIdSearchParam,
    variables: {
      orderId: orderIdSearchParam,
    },
  })

  const handleBeforeUnload = React.useCallback(
    (event: BeforeUnloadEvent) => {
      if (isNotSafeToRedirect) {
        event.preventDefault()
        return (event.returnValue = SURE_YOU_WANT_LEAVE_MESSAGE)
      }
    },
    [isNotSafeToRedirect],
  )

  const initialize = React.useCallback(async () => {
    switch (baseTypeQueryParam) {
      // If the user canceled the order from an external location (currently
      // this would just be Stripe Checkout), there should be an orderId query param
      // that we fired off an "orders" query with above, wait for its result
      case 'cancel': {
        if (!loadExistingOrderQuery.called || loadExistingOrderQuery.loading) {
          return null
        }

        const existingOrder = existingOrderData?.order
        if (!existingOrder) {
          return history.push('/shop')
        }

        // Build up the card builder state from the order specified in the orderId search param
        const cardBuilderStateFromBefore = await createCardBuilderStateFromExistingOrder(
          existingOrder,
        )
        updateCardBuilderState(cardBuilderStateFromBefore)

        history.push(
          `/card-studio/${existingOrder.cardVersion.baseType.toLowerCase()}`,
        )
        break
      }
      // This means the user landed here after a successful Stripe Checkout payment + redirection.
      // The URL would have an `?orderId=ord_*` on it so we can use that to redirect them to the
      // order detail view for this completed order.
      case 'success': {
        history.push(`/dashboard/orders/${orderIdSearchParam}`)
        break
      }
      // Request an initialized CardVersion from the API when the card builder loads so we can use its id
      // for things like the QR code URL
      case 'custom':
      case 'template': {
        if (
          cardBuilderState.cardVersionId ||
          initializeCardBuilderMutationResult.called
        ) {
          return
        }

        try {
          const result = await initializeCardBuilder({
            variables: {
              baseType: cardBuilderState.baseType,
            },
          })
          if (result.errors) {
            Sentry.captureException(result.errors)
            setFatalError(
              'Our server is having a bad day. 😭 Please try again later!',
            )
          }
          updateCardBuilderState({
            cardVersionId: result.data?.createEmptyCardVersion.id,
          })
        } catch (err) {
          Sentry.captureException(err)
          setFatalError(
            'Our server is having a bad day. 😭 Please try again later!',
          )
        }

        break
      }
      default:
        // Should never come to this
        break
    }
  }, [
    orderIdSearchParam,
    existingOrderData,
    loadExistingOrderQuery.called,
    loadExistingOrderQuery.loading,
    history,
    baseTypeQueryParam,
    initializeCardBuilder,
    initializeCardBuilderMutationResult,
    cardBuilderState,
    updateCardBuilderState,
  ])

  React.useEffect(() => {
    initialize()
    // Set up the proper listeners to detect if user is leaving
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [initialize, handleBeforeUnload])

  const stripe = useStripe()
  const [submitCustomOrder] = useMutation<SubmitCustomOrderMutation>(
    SUBMIT_CUSTOM_ORDER_MUTATION,
  )
  const [submitTemplateOrder] = useMutation<SubmitTemplateOrderMutation>(
    SUBMIT_TEMPLATE_ORDER_MUTATION,
  )

  const submitOrder = React.useCallback(async () => {
    const { quantity, previousOrder } = cardBuilderState

    // The parameters needed for both custom and template-based orders
    const basePayload:
      | Partial<SubmitCustomOrderMutationVariables['payload']>
      | Partial<SubmitTemplateOrderMutationVariables['payload']> = {
      previousOrder,
      quantity: quantity ?? undefined,
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
    setIsNotSafeToRedirect(false)
    try {
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
    } finally {
      setIsNotSafeToRedirect(true)
    }
  }, [submitOrder, stripe, setIsNotSafeToRedirect])

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

          updateCardBuilderState({
            omittedOptionalFields: getAllOmittedContactFields(
              cardBuilderState.templateId,
              cardBuilderState.templateCustomization?.contactInfo,
            ),
          })
        }
        break
      default:
        break
    }

    updateCardBuilderState(cardBuilderStateUpdate)
  }

  if (baseTypeQueryParam === 'success' || baseTypeQueryParam === 'cancel') {
    return <LoadingPage fullscreen />
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
            completionButtonLabel="Continue to payment"
            currentStep={cardBuilderState.currentStep}
            handleStepTransition={handleWizardStepTransition}
            handleSubmit={handleWizardSubmit}
            readyToStart={cardBuilderState.cardVersionId != null}
            fatalError={fatalError}
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
              id="review"
              icon="checkO"
              label="Review"
              isReadyForNextStep={[cardBuilderState.quantity != null].every(
                Boolean,
              )}
            >
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

          <Prompt
            when={isNotSafeToRedirect}
            message={SURE_YOU_WANT_LEAVE_MESSAGE}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
