import { useMutation } from '@apollo/react-hooks'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { ExecutionResult } from 'apollo-link'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom'
import {
  UpsertCustomOrderMutation,
  UpsertCustomOrderMutationVariables,
} from 'src/apollo/types/UpsertCustomOrderMutation'
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
  BaseType,
  cardBuilderReducer,
  CardBuilderStep,
  CheckoutFormData,
  initialState,
} from './reducer'
import ReviewStep from './ReviewStep'
import UPSERT_CUSTOM_ORDER_MUTATION from './upsertCustomOrderMutation'

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
  const [upsertCustomOrder] = useMutation(UPSERT_CUSTOM_ORDER_MUTATION)

  const frontImageDataUrl = cardBuilderState.frontDesignFile?.url
  const backImageDataUrl = cardBuilderState.backDesignFile?.url

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

  const handleOrderUpdate = React.useCallback(async () => {
    console.log('TODO: call upsertCustomOrder')
  }, [])

  const handleOrderSubmit = React.useCallback(async () => {
    debugger

    if (stripe == null) {
      // TODO: Handle errors gracefully
      return
    }

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
      UpsertCustomOrderMutationVariables['payload']
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

    let orderCreateResult: ExecutionResult<UpsertCustomOrderMutation> | null = null
    if (cardBuilderState.baseType === 'custom') {
      orderCreateResult = await upsertCustomOrder({
        variables: {
          payload: {
            ...basePayload,
            cardSpec: {
              frontImageDataUrl,
              backImageDataUrl,
            },
          },
        },
      })
    } else if (cardBuilderState.baseType === 'template') {
      // TODO: Implement template
    }

    if (orderCreateResult?.data?.upsertCustomOrder.clientSecret == null) {
      throw new Error('boo')
    }

    const payload = await stripe.confirmCardPayment(
      orderCreateResult?.data?.upsertCustomOrder.clientSecret,
      {
        // eslint-disable-next-line camelcase
        payment_method: {
          card: {
            token: stripeToken.id,
          },
          // eslint-disable-next-line camelcase
          billing_details: {
            name: formData.name,
          },
        },
      },
    )

    if (payload.error) {
      throw payload.error
    } else if (payload.paymentIntent == null) {
      throw new Error('paymentIntent in response undefined')
    } else {
      updateCardBuilderState({ paymentIntent: payload.paymentIntent })
    }
  }, [
    stripe,
    cardBuilderState,
    upsertCustomOrder,
    frontImageDataUrl,
    backImageDataUrl,
  ])

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
  // When it isn't (e.g. when user is on the final "Review" step), watchedFields is empty
  // so we need to get the cached data from cardBuilderState instead
  const formData =
    Object.keys(watchedFields).length === 0 && cardBuilderState.formData
      ? cardBuilderState.formData
      : watchedFields

  const handleWizardStepTransition = async (_goingToStep: string) => {
    const comingFromStep = cardBuilderState.currentStep
    const goingToStep = _goingToStep as CardBuilderStep

    updateCardBuilderState({
      currentStep: goingToStep,
    })

    // TODO: Flesh out this state machine / transition handler
    switch (comingFromStep) {
      case 'build':
        if (goingToStep === 'checkout') {
          // updateOrderState()
        }
        break
      case 'checkout':
        // Moving to any step
        updateCardBuilderState({
          formData: checkoutFormMethods.getValues(),
        })

        // Only when moving forward
        if (goingToStep === 'review') {
          await handleOrderUpdate()
          if (!cardBuilderState.stripeToken) {
            await handleCardSubmit()
          }
        }
        break
      case 'review':
        // TODO: Figure out a better way to handle wizard completion than using a hardcoded step
        if (goingToStep === 'complete') {
          handleOrderSubmit()
        }
        break
    }
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
            exitPath="/dashboard/orders"
            exitText="Submit order"
            currentStep={cardBuilderState.currentStep}
            handleStepTransition={handleWizardStepTransition}
          >
            {isValidBaseType(buildBaseType) && buildBaseType === 'template' && (
              <WizardStep id="base" icon="stack" label="Base">
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
              accessCondition={[
                ...{
                  custom: [],
                  // For template base type, the template must have been chosen
                  template: [cardBuilderState.templateId != null],
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
              accessCondition={[
                ...{
                  // For custom base type, at least the front design file must have been provided
                  custom: [cardBuilderState.frontDesignFile != null],
                  // TBD requirements for template
                  template: [],
                }[cardBuilderState.baseType],
              ].every(Boolean)}
            >
              <CheckoutStep
                cardBuilderState={cardBuilderState}
                updateCardBuilderState={updateCardBuilderState}
                handleCardSubmit={handleCardSubmit}
                checkoutFormMethods={checkoutFormMethods}
              />
            </WizardStep>
            <WizardStep
              id="review"
              icon="checkO"
              label="Review"
              // All required form fields must have been filled out from checkout step
              accessCondition={[
                formData.addressLine1,
                formData.state,
                formData.city,
                formData.postalCode,
                formData.name,
                cardBuilderState.cardEntryComplete,
              ].every(Boolean)}
            >
              <ReviewStep cardBuilderState={cardBuilderState} />
            </WizardStep>
          </Wizard>
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
