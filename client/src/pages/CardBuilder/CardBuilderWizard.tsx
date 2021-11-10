import { useStripe } from '@stripe/react-stripe-js'
import * as React from 'react'
import { Prompt, Redirect, useHistory, useLocation } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { CardSpecBaseType } from 'src/apollo/types/globalTypes'
import { InitializeCardBuilder } from 'src/apollo/types/InitializeCardBuilder'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import Wizard, { WizardStep } from 'src/components/Wizard'
import BaseStep from 'src/pages/CardBuilder/BaseStep'
import {
  CardBuilderAction,
  CardBuilderLocationState,
  cardBuilderReducer,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import CustomBuildStep from 'src/pages/CardBuilder/CustomBuildStep'
import CustomReviewStep from 'src/pages/CardBuilder/CustomReviewStep'
import { INITIALIZE_CARD_BUILDER_MUTATION } from 'src/pages/CardBuilder/mutations'
import TemplateBuildStep from 'src/pages/CardBuilder/TemplateBuildStep'
import TemplateReviewStep from 'src/pages/CardBuilder/TemplateReviewStep'
import { CardBuilderStep } from 'src/pages/CardBuilder/types'
import {
  CustomImagesValidationResult,
  useSubmitOrder,
  validateCustomImages,
} from 'src/pages/CardBuilder/util'
import breakpoints, { useBreakpoint } from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import templateLibrary from 'src/templates'
import { getAllOmittedContactFields } from 'src/templates/utils'
import { useAuth } from 'src/utils/auth'

const ROUTE_REGEX = /\/card-studio\/([^/]*)\/?/
const VALID_SUBROUTES = ['custom', 'template'] as const
type ValidSubroute = typeof VALID_SUBROUTES[number]
const isValidSubroute = (subroute: string): subroute is ValidSubroute =>
  ([...VALID_SUBROUTES] as string[]).includes(subroute)

const SURE_YOU_WANT_LEAVE_MESSAGE =
  "Are you sure you want to leave? You'll lose the information you've entered so far."
const bp = 'lg'

interface Props {
  fatalError: Error | null
  setFatalError: (e: Error) => void
}

const CardBuilder = ({ fatalError, setFatalError }: Props) => {
  const location = useLocation<CardBuilderLocationState | undefined>()
  const locationMatch = location.pathname.match(ROUTE_REGEX)
  const subrouteParam = locationMatch ? locationMatch[1] : null
  const history = useHistory()
  const isDesktop = useBreakpoint('lg')
  const { loggedIn } = useAuth()
  const stripe = useStripe()

  const [isNotSafeToRedirect, setIsNotSafeToRedirect] = React.useState(true)
  const [
    customImagesValidationStatus,
    setCustomImagesValidationStatus,
  ] = React.useState<CustomImagesValidationResult | null>(null)

  const baseType =
    subrouteParam && isValidSubroute(subrouteParam)
      ? {
          custom: CardSpecBaseType.Custom,
          template: CardSpecBaseType.Template,
        }[subrouteParam]
      : CardSpecBaseType.Template

  const [cardBuilderState, updateCardBuilderState] = React.useReducer(
    cardBuilderReducer,
    (() => {
      const initialState = initialStateOptions[baseType]
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
    // If baseType hasn't been determined yet, we don't know how to initialize
    // so skip it this time
    if (baseType == null) {
      return
    }

    // Check if the location state contains data about a previous card builder session
    // e.g. from /card-studio/cancel/:orderId being hit which will redirect to here
    // with location state populated. See CardBuilderCanceledCheckout component for more details.
    if (location.state?.cardBuilderState) {
      updateCardBuilderState(location.state.cardBuilderState)
      return
    }

    if (
      cardBuilderState.cardVersionId ||
      initializeCardBuilderMutationResult.called
    ) {
      return
    }

    // Request an initialized CardVersion from the API when the card builder loads so we can use its id
    // for things like the QR code URL
    const result = await initializeCardBuilder({
      variables: {
        baseType: cardBuilderState.baseType,
      },
    })
    if (result.errors) {
      throw result.errors[0]
    }
    updateCardBuilderState({
      orderId: result.data?.createEmptyOrderForCardBuilder.id,
      cardVersionId:
        result.data?.createEmptyOrderForCardBuilder?.cardVersion?.id,
    })
  }, [
    cardBuilderState,
    initializeCardBuilder,
    initializeCardBuilderMutationResult,
    location,
    baseType,
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

  React.useEffect(() => {
    validateCustomImages(
      cardBuilderState.frontDesignFile?.url,
      cardBuilderState.backDesignFile?.url,
    ).then(setCustomImagesValidationStatus)
  }, [
    cardBuilderState.frontDesignFile,
    cardBuilderState.backDesignFile,
    setCustomImagesValidationStatus,
  ])

  const submitOrder = useSubmitOrder()

  const handleWizardSubmit = React.useCallback(async () => {
    setIsNotSafeToRedirect(false)
    try {
      const submitOrderResult = await submitOrder(cardBuilderState)

      if (submitOrderResult == null) {
        throw new Error('Failed to create order, submitOrderResult was null')
      }

      // User isn't logged in; redirect them to the registration page first so
      // they can create an account or log in to link this order to their account
      if (!loggedIn || submitOrderResult.checkoutSession == null) {
        const redirectUrl = `/card-studio/authenticated/${cardBuilderState.orderId}`
        const searchParams = new URLSearchParams({
          // eslint-disable-next-line camelcase
          redirect_url: redirectUrl,
        })
        history.push(`/register?${searchParams.toString()}`, {
          linkingOrder: cardBuilderState.orderId,
        })
        return
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
  }, [
    loggedIn,
    submitOrder,
    stripe,
    setIsNotSafeToRedirect,
    history,
    cardBuilderState,
  ])

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

  if (!subrouteParam || !isValidSubroute(subrouteParam)) {
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
                  selectedBaseType={baseType}
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
                  [CardSpecBaseType.Custom]:
                    cardBuilderState.frontDesignFile != null &&
                    customImagesValidationStatus?.backSizeCorrect &&
                    customImagesValidationStatus.frontSizeCorrect &&
                    customImagesValidationStatus.sizesMatch,
                  [CardSpecBaseType.Template]:
                    cardBuilderState.templateId != null &&
                    cardBuilderState.templateCustomization != null &&
                    templateLibrary[cardBuilderState.templateId].isComplete(
                      cardBuilderState.templateCustomization as any,
                    ),
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
