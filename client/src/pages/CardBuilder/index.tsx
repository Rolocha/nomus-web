import { useMutation } from '@apollo/react-hooks'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { ExecutionResult } from 'apollo-link'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  CreateCustomOrderMutation,
  CreateCustomOrderMutationVariables,
} from 'src/apollo/types/CreateCustomOrderMutation'
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
import CREATE_CUSTOM_ORDER_MUTATION from './createCustomOrderMutation'
import { cardBuilderReducer, CheckoutFormData, initialState } from './reducer'
import ReviewStep from './ReviewStep'

interface ParamsType {
  buildBaseType?: string
}

const bp = 'md'

interface Props {}

const CardBuilder = ({}: Props) => {
  const params = useParams<ParamsType>()

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
  const [createCustomOrder] = useMutation(CREATE_CUSTOM_ORDER_MUTATION)

  const frontImageDataUrl = cardBuilderState.frontDesignFile?.url
  const backImageDataUrl = cardBuilderState.backDesignFile?.url

  const handleCardSubmit = React.useCallback(async () => {
    if (stripe == null || elements == null) {
      // throw new Error('Stripe and/or Stripe Elements not initialized')
      return
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

  const handleOrderSubmit = React.useCallback(async () => {
    if (stripe == null) {
      console.log('stripe was null')
      return
    }

    const { formData, stripeToken } = cardBuilderState
    const cardElement = elements?.getElement('card')

    if (
      formData == null ||
      formData.name == null ||
      formData.addressLine1 == null ||
      formData.city == null ||
      formData.state == null ||
      formData.postalCode == null ||
      stripeToken == null ||
      cardElement == null
    ) {
      console.log('missing data')
      return
    }

    const basePayload: Partial<
      CreateCustomOrderMutationVariables['payload']
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
      CreateCustomOrderMutation
    > | null = null
    if (cardBuilderState.baseType === 'custom') {
      orderCreateResult = await createCustomOrder({
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

    if (orderCreateResult?.data?.createCustomOrder.clientSecret == null) {
      throw new Error('boo')
    }

    const payload = await stripe.confirmCardPayment(
      orderCreateResult?.data?.createCustomOrder.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
          },
        },
      },
    )

    if (payload.error) {
      throw payload.error
    } else if (payload.paymentIntent == null) {
      throw new Error('paymentIntent response in undefined')
    } else {
      updateCardBuilderState({ paymentIntent: payload.paymentIntent })
    }
  }, [])

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
          maxHeight="900px"
          height={`calc(100vh - 100px)`}
          maxWidth={{ [bp]: `calc(1.5 * ${breakpoints.lg})` }}
          display="flex"
          flexDirection="column"
        >
          <Box mt={4} mb="24px" display={{ _: 'none', [bp]: 'block' }}>
            <Text.PageHeader>Card Builder</Text.PageHeader>
          </Box>
          <Wizard
            exitPath="/"
            exitText="Submit order"
            steps={[
              {
                key: 'step-1-base',
                label: 'Base',
                Icon: SVG.Stack,
                content: (
                  <BaseStep
                    selectedBaseType={params.buildBaseType}
                    cardBuilderState={cardBuilderState}
                    updateCardBuilderState={updateCardBuilderState}
                  />
                ),
                accessCondition: true,
              },
              {
                key: 'step-2-build',
                label: 'Build',
                Icon: SVG.FormatText,
                content: (
                  <BuildStep
                    selectedBaseType={params.buildBaseType}
                    cardBuilderState={cardBuilderState}
                    updateCardBuilderState={updateCardBuilderState}
                  />
                ),
                accessCondition: [
                  cardBuilderState.baseType != null,
                  cardBuilderState.baseType === 'template'
                    ? cardBuilderState.templateId != null
                    : true,
                ].every(Boolean),
              },
              {
                key: 'step-3-checkout',
                label: 'Checkout',
                Icon: SVG.Cart,
                content: (
                  <CheckoutStep
                    cardBuilderState={cardBuilderState}
                    updateCardBuilderState={updateCardBuilderState}
                    handleCardSubmit={handleCardSubmit}
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
                key: 'step-4-review',
                label: 'Review',
                Icon: SVG.CheckO,
                content: (
                  <ReviewStep
                    cardBuilderState={cardBuilderState}
                    handleOrderSubmit={handleOrderSubmit}
                  />
                ),
                accessCondition: [
                  watchedFields?.addressLine1,
                  watchedFields?.state,
                  watchedFields?.city,
                  watchedFields?.postalCode,
                  watchedFields?.name,
                  cardBuilderState.cardEntryComplete,
                ].every(Boolean),
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default CardBuilder
