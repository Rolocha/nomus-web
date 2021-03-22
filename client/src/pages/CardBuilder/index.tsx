import { useMutation } from '@apollo/react-hooks'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { ExecutionResult } from 'apollo-link'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom'
import {
  SubmitCustomOrderMutation,
  SubmitCustomOrderMutationVariables,
} from 'src/apollo/types/SubmitCustomOrderMutation'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import Wizard, { WizardStep } from 'src/components/Wizard'
import breakpoints from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import BaseStep from './BaseStep'
import BuildStep from './BuildStep'
import CheckoutStep from './CheckoutStep'
import {
  CardBuilderAction,
  cardBuilderReducer,
  initialState,
} from './card-builder-state'
import { BaseType, CardBuilderStep, CheckoutFormData } from './types'
import ReviewStep from './ReviewStep'
import SUBMIT_CUSTOM_ORDER_MUTATION from './upsertCustomOrderMutation'

interface ParamsType {
  buildBaseType?: string
}

const bp = 'md'

const CardBuilder = () => {
  const { buildBaseType } = useParams<ParamsType>()
  const location = useLocation()
  const history = useHistory()

  const [cardBuilderState, updateCardBuilderState] = React.useReducer(
    cardBuilderReducer,
    initialState,
  )

  const checkoutFormMethods = useForm<CheckoutFormData>({
    defaultValues: cardBuilderState.formData ?? undefined,
  })

  const watchedFields = checkoutFormMethods.watch()

  const stripe = useStripe()
  const elements = useElements()
  const [submitCustomOrder] = useMutation(SUBMIT_CUSTOM_ORDER_MUTATION)

  const handleCardSubmit = React.useCallback(async () => {
    if (stripe == null || elements == null) {
      throw new Error('Stripe and/or Stripe Elements not initialized')
    }

    const card = elements.getElement(CardElement)
    if (card == null) {
      throw new Error('Could not find a Card Element')
    }

    try {
      const result = await stripe.createToken(card)
      if (result.error == null && result.token != null) {
        const { token: stripeToken } = result
        updateCardBuilderState({ stripeToken })
      }
    } catch (err) {
    } finally {
    }
  }, [stripe, elements])

  const confirmCardPayment = React.useCallback(
    async (clientSecret: string) => {
      if (stripe == null || cardBuilderState.stripeToken == null) {
        // TODO: Handle errors gracefully
        throw new Error('stripe is not defined or the token is missing')
      }

      return stripe.confirmCardPayment(clientSecret, {
        // eslint-disable-next-line camelcase
        payment_method: {
          card: {
            token: cardBuilderState.stripeToken.id,
          },
          // eslint-disable-next-line camelcase
          billing_details: {
            name: cardBuilderState.formData.name,
          },
        },
      })
    },
    [cardBuilderState, stripe],
  )

  const createOrder = React.useCallback(async () => {
    const { formData, stripeToken } = cardBuilderState

    if (
      formData == null ||
      formData.name == null ||
      formData.addressLine1 == null ||
      formData.city == null ||
      formData.state == null ||
      formData.postalCode == null ||
      stripeToken == null
    ) {
      console.log('missing data')
      return
    }

    const basePayload: Partial<
      SubmitCustomOrderMutationVariables['payload']
    > = {
      shippingAddress: {
        line1: formData?.addressLine1,
        line2: formData?.addressLine2,
        city: formData?.city,
        state: formData?.state,
        postalCode: formData?.postalCode,
      },
      quantity: 50,
      stripeToken: stripeToken?.id,
    }

    let orderCreateResult: ExecutionResult<SubmitCustomOrderMutation> | null = null
    if (cardBuilderState.baseType === 'custom') {
      orderCreateResult = await submitCustomOrder({
        variables: {
          payload: {
            ...basePayload,
            cardSpec: {
              frontImageDataUrl: cardBuilderState.frontDesignFile?.file,
              backImageDataUrl: cardBuilderState.backDesignFile?.file,
            },
          },
        },
      })
    } else if (cardBuilderState.baseType === 'template') {
      // TODO: Implement template
    }
    return orderCreateResult
  }, [cardBuilderState, submitCustomOrder])

  const handleWizardSubmit = React.useCallback(async () => {
    const createOrderResult = await createOrder()
    if (createOrderResult?.data?.submitCustomOrder.clientSecret == null) {
      console.log(createOrderResult?.errors)
      throw new Error('Failed to create order: ')
    }

    const cardConfirmationResult = await confirmCardPayment(
      createOrderResult.data.submitCustomOrder?.clientSecret,
    )

    if (cardConfirmationResult.error) {
      throw cardConfirmationResult.error
    } else if (cardConfirmationResult.paymentIntent == null) {
      throw new Error('paymentIntent in response undefined')
    }
    updateCardBuilderState({
      paymentIntent: cardConfirmationResult.paymentIntent,
    })

    // All done, redirect to the dashboard for this order
    history.push(
      `/dashboard/orders/${createOrderResult.data.submitCustomOrder.orderId}`,
    )
  }, [confirmCardPayment, createOrder, history])

  React.useEffect(() => {
    if (!location.pathname.endsWith(cardBuilderState.currentStep)) {
      // history.push(cardBuilderState.currentStep)
    }
  }, [cardBuilderState.currentStep, history, location])

  const isValidBaseType = (type?: string): type is BaseType =>
    type != null && ['custom', 'template'].includes(type)

  if (!isValidBaseType(buildBaseType)) {
    // If user goes straight to `/card-studio` or `/card-studio/adsdfsaf`, redirect them to the shop front
    return <Redirect to="/shop" />
  }

  // When the checkout form is mounted, the most up-to-date data comes from watchedFields
  // since the user may be editing the fields. On wizard step change, we cache the form data to
  // cardBuilderState before react-hook-form unmounts the input (and watchedFields becomes empty)
  // so if we're not on the checkout step, use that cache instead
  const formData =
    cardBuilderState.currentStep === 'checkout'
      ? watchedFields
      : cardBuilderState.formData

  const handleWizardStepTransition = async (_goingToStep: string) => {
    const comingFromStep = cardBuilderState.currentStep
    const goingToStep = _goingToStep as CardBuilderStep

    const cardBuilderStateUpdate: CardBuilderAction = {}

    // (base) => build => checkout => review
    switch (comingFromStep) {
      case 'checkout':
        // Cache the current form data in cardBuilderState since react-hook-form
        // will drop it when the form fields unmount
        cardBuilderStateUpdate.formData = checkoutFormMethods.getValues()
        if (!cardBuilderState.stripeToken) {
          await handleCardSubmit()
        }
        break
      default:
        break
    }

    updateCardBuilderState({
      ...cardBuilderStateUpdate,
      currentStep: goingToStep,
    })
  }

  return (
    <Box
      bg={theme.colors.ivory}
      minHeight={{ [bp]: '100vh' }}
      minWidth={{ base: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar />
      <Box
        container
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box
          maxWidth={{ [bp]: `calc(1.5 * ${breakpoints.lg})` }}
          display="flex"
          flexDirection="column"
        >
          <Box mt={4} mb="24px" display={{ base: 'none', [bp]: 'block' }}>
            <Text.PageHeader>Card Builder</Text.PageHeader>
          </Box>
          <Wizard
            completionButtonLabel="Submit order"
            currentStep={cardBuilderState.currentStep}
            handleStepTransition={handleWizardStepTransition}
            handleSubmit={handleWizardSubmit}
          >
            {isValidBaseType(buildBaseType) && buildBaseType === 'template' && (
              <WizardStep
                id="base"
                icon="stack"
                label="Base"
                isReadyForNextStep={[
                  ...{
                    custom: [],
                    // For template base type, the template must have been chosen
                    template: [cardBuilderState.templateId != null],
                  }[cardBuilderState.baseType],
                ].every(Boolean)}
              >
                <BaseStep
                  selectedBaseType={buildBaseType}
                  cardBuilderState={cardBuilderState}
                />
              </WizardStep>
            )}
            <WizardStep
              id="build"
              icon="formatText"
              label="Build"
              isReadyForNextStep={[
                ...{
                  // For custom base type, at least the front design file must have been provided
                  custom: [cardBuilderState.frontDesignFile != null],
                  // TBD requirements for template
                  template: [],
                }[cardBuilderState.baseType],
              ].every(Boolean)}
            >
              <BuildStep
                selectedBaseType={buildBaseType}
                cardBuilderState={cardBuilderState}
                updateCardBuilderState={updateCardBuilderState}
              />
            </WizardStep>
            <WizardStep
              id="checkout"
              icon="cart"
              label="Checkout"
              isReadyForNextStep={[
                formData.addressLine1,
                formData.state,
                formData.city,
                formData.postalCode,
                formData.name,
                cardBuilderState.cardEntryComplete,
              ].every(Boolean)}
            >
              <CheckoutStep
                cardBuilderState={cardBuilderState}
                updateCardBuilderState={updateCardBuilderState}
                handleCardSubmit={handleCardSubmit}
                checkoutFormMethods={checkoutFormMethods}
              />
            </WizardStep>
            <WizardStep id="review" icon="checkO" label="Review">
              <ReviewStep cardBuilderState={cardBuilderState} />
            </WizardStep>
          </Wizard>
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
