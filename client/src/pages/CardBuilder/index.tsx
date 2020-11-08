import { useMutation } from '@apollo/react-hooks'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { ExecutionResult } from 'apollo-link'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useParams } from 'react-router-dom'
import {
  UpsertCustomOrderMutation,
  UpsertCustomOrderMutationVariables,
} from 'src/apollo/types/UpsertCustomOrderMutation'
import Box from 'src/components/Box'
import Navbar from 'src/components/Navbar'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import Wizard from 'src/components/Wizard'
import breakpoints from 'src/styles/breakpoints'
import theme from 'src/styles/theme'
import BaseStep from './BaseStep'
import BuildStep from './BuildStep'
import CheckoutStep from './CheckoutStep'
import UPSERT_CUSTOM_ORDER_MUTATION from './upsertCustomOrderMutation'
import {
  cardBuilderReducer,
  CheckoutFormData,
  initialState,
  BaseType,
} from './reducer'
import ReviewStep from './ReviewStep'

interface ParamsType {
  buildBaseType?: string
}

const bp = 'md'

const CardBuilder = () => {
  const { buildBaseType } = useParams<ParamsType>()

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

    let orderCreateResult: ExecutionResult<
      UpsertCustomOrderMutation
    > | null = null
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

  const wizardSteps = [
    {
      key: 'build',
      label: 'Build',
      Icon: SVG.FormatText,
      content: (
        <BuildStep
          selectedBaseType={buildBaseType}
          cardBuilderState={cardBuilderState}
          updateCardBuilderState={updateCardBuilderState}
          handleOrderUpdate={handleOrderUpdate}
        />
      ),
      accessCondition: [
        {
          custom: true,
          template: cardBuilderState.templateId != null,
        }[buildBaseType],
      ].every(Boolean),
    },
    {
      key: 'checkout',
      label: 'Checkout',
      Icon: SVG.Cart,
      content: (
        <CheckoutStep
          cardBuilderState={cardBuilderState}
          updateCardBuilderState={updateCardBuilderState}
          handleCardSubmit={handleCardSubmit}
          handleOrderUpdate={handleOrderUpdate}
          checkoutFormMethods={checkoutFormMethods}
        />
      ),
      accessCondition: [
        ...{
          custom: [cardBuilderState.frontDesignFile != null],
          template: [],
        }[cardBuilderState.baseType],
      ].every(Boolean),
    },
    {
      key: 'review',
      label: 'Review',
      Icon: SVG.CheckO,
      content: (
        <ReviewStep
          cardBuilderState={cardBuilderState}
          handleOrderSubmit={handleOrderSubmit}
        />
      ),
      accessCondition: () =>
        [
          formData.addressLine1,
          formData.state,
          formData.city,
          formData.postalCode,
          formData.name,
          cardBuilderState.cardEntryComplete,
        ].every(Boolean),
    },
  ]

  // If template base type, add in a step at the beginning for template selection
  if (isValidBaseType(buildBaseType) && buildBaseType === 'template') {
    wizardSteps.splice(0, 0, {
      key: 'base',
      label: 'Base',
      Icon: SVG.Stack,
      content: (
        <BaseStep
          selectedBaseType={buildBaseType}
          cardBuilderState={cardBuilderState}
          updateCardBuilderState={updateCardBuilderState}
        />
      ),
      accessCondition: true,
    })
  }
  return (
    <Box
      bg={theme.colors.ivory}
      minHeight={{ [bp]: '100vh' }}
      minWidth={{ _: '0', [bp]: `calc(1.1 * ${breakpoints.lg})` }}
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
    >
      <Navbar />
      <Box
        pb={{ [bp]: 4 }}
        px={{ _: 0, [bp]: 5 }}
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
          <Box mt={4} mb="24px" display={{ _: 'none', [bp]: 'block' }}>
            <Text.PageHeader>Card Builder</Text.PageHeader>
          </Box>
          <Wizard
            exitPath="/dashboard/orders"
            exitText="Submit order"
            steps={wizardSteps}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
