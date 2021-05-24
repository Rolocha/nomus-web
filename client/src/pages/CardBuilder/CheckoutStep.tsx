import * as stripeJs from '@stripe/stripe-js'
import * as React from 'react'
import { UseFormMethods } from 'react-hook-form'
import Box from 'src/components/Box'
import Card from 'src/components/Card'
import CreditCardInput from 'src/components/CreditCardInput'
import * as Form from 'src/components/Form'
import Link from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import { formatDollarAmount } from 'src/utils/money'
import { getCostSummary, QUANTITY_TO_PRICE } from 'src/utils/pricing'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
  handleCardSubmit: () => Promise<void>
  checkoutFormMethods: UseFormMethods<any>
}

const CheckoutStep = ({
  cardBuilderState,
  updateCardBuilderState,
  handleCardSubmit,
  checkoutFormMethods,
}: Props) => {
  const loadedPreviousFormState = React.useRef(false)
  // Prepopulate the form on load if we already have data from a previous visit of this step
  React.useEffect(() => {
    if (cardBuilderState.formData && !loadedPreviousFormState.current) {
      checkoutFormMethods.reset(cardBuilderState.formData)
      loadedPreviousFormState.current = true
    }
  }, [cardBuilderState.formData, checkoutFormMethods, loadedPreviousFormState])

  // Handle real-time validation errors from the card Element.
  const handleCardInputChange = (
    event: stripeJs.StripeCardElementChangeEvent,
  ) => {
    updateCardBuilderState({ cardEntryComplete: event.complete })
    // TODO: Handle errors from event.error
  }

  const costSummary = getCostSummary(
    cardBuilderState.quantity,
    checkoutFormMethods.getValues('state'),
  )

  const quantityOptions = ([
    {
      quantity: 25,
      icon: <SVG.Smile1 />,
      description:
        'Just enough to get you started in the NFC business cards game.',
    },
    {
      quantity: 50,
      icon: <SVG.Smile2 />,
      description:
        'You’ll be perfectly stocked for your next event or conference.',
    },
    {
      quantity: 100,
      icon: <SVG.Smile3 />,
      description: 'Somebody’s popular! Or planning ahead. Or both.',
    },
  ] as const).map(({ quantity, description, icon }) => {
    const price = QUANTITY_TO_PRICE[quantity]
    const selected = cardBuilderState.quantity === quantity
    return (
      <Box
        transition="0.3s ease transform"
        transform={`scale(${selected ? 1.05 : 1})`}
      >
        <Card
          key={quantity}
          topBarColor={
            cardBuilderState.quantity === quantity ? 'gold' : 'disabledBlue'
          }
          align="mix"
          size="small"
          icon={icon}
          header={`${quantity} cards / ${formatDollarAmount(price)}`}
          subheader={`${formatDollarAmount(
            Math.round(price / quantity),
          )} per card`}
          bodyText={description}
          boxShadow={selected ? 'prominent' : 'workingWindow'}
          onClick={() =>
            updateCardBuilderState({
              quantity,
            })
          }
        />
      </Box>
    )
  })

  return (
    <Box height="100%">
      <Text.SectionHeader mb="24px">Order details</Text.SectionHeader>
      <Text.SectionSubheader mb={2}>
        How many cards do you want?
      </Text.SectionSubheader>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 4fr)"
        gridColumnGap={3}
        gridRowGap={2}
      >
        {quantityOptions}
        <Box gridColumn="3/4" gridRow="2/2" placeSelf="start end">
          <Link to="#">
            <Text.Body2 color="inherit">
              Need more than 100? Let us know.
            </Text.Body2>
          </Link>
        </Box>
      </Box>

      <Form.Form onSubmit={checkoutFormMethods.handleSubmit(handleCardSubmit)}>
        <Text.SectionSubheader>Shipping information</Text.SectionSubheader>
        <Box
          display="grid"
          gridTemplateColumns="6fr 2fr 4fr"
          overflow="visible"
          pr={2}
        >
          <Box>
            <Box
              display="grid"
              gridTemplateColumns="repeat(6, 1fr)"
              gridColumnGap={3}
              gridRowGap={3}
              justifyItems="stretch"
            >
              <Box gridColumn="1/5">
                <Form.Label>Name</Form.Label>
                <Form.Input
                  name="name"
                  ref={checkoutFormMethods.register}
                  width="100%"
                />
              </Box>
              <Box gridColumn="1/7" gridRow="2/2">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Input
                  name="addressLine1"
                  ref={checkoutFormMethods.register}
                  width="100%"
                />
              </Box>
              <Box gridColumn="1/7" gridRow="3/3">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Input
                  name="addressLine2"
                  ref={checkoutFormMethods.register}
                  width="100%"
                />
              </Box>
              <Box gridColumn="1/4" gridRow="4/4">
                <Form.Label>City</Form.Label>
                <Form.Input
                  name="city"
                  ref={checkoutFormMethods.register}
                  width="100%"
                />
              </Box>
              <Box gridColumn="4/5" gridRow="4/4">
                <Form.Label>State</Form.Label>
                <Form.Input
                  name="state"
                  type="text"
                  ref={checkoutFormMethods.register}
                  width="100%"
                  maxLength={2}
                />
              </Box>
              <Box gridColumn="5/7" gridRow="4/4">
                <Form.Label>Zip Code</Form.Label>
                <Form.Input
                  name="postalCode"
                  ref={checkoutFormMethods.register}
                  width="100%"
                />
              </Box>

              <Box gridColumn="1/7" gridRow="5/5">
                <Form.Label htmlFor="card-element">
                  Credit or debit card
                </Form.Label>
                {cardBuilderState.stripeToken ? (
                  <Text.Body2>{`**** **** **** ${cardBuilderState?.stripeToken?.card?.last4}`}</Text.Body2>
                ) : (
                  <CreditCardInput
                    id="card-element"
                    handleChange={handleCardInputChange}
                    postalCode={checkoutFormMethods.getValues().postalCode}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Box />
          <Box
            width="100%"
            boxShadow="workingWindow"
            borderRadius="lg"
            placeSelf="end end"
            p={4}
            display="grid"
            gridTemplateColumns="2fr 1fr 1fr"
            sx={{
              '& > *:nth-child(3n)': {
                placeSelf: 'center end',
              },
            }}
            gridRowGap={3}
          >
            <Text.Body2>Subtotal</Text.Body2>
            <Box></Box>
            <Text.Body2>
              {costSummary?.subtotal
                ? formatDollarAmount(costSummary.subtotal)
                : '...'}
            </Text.Body2>

            <Text.Body2>Estimated Taxes</Text.Body2>
            <Box></Box>
            <Text.Body2>
              {costSummary?.estimatedTaxes
                ? formatDollarAmount(costSummary.estimatedTaxes)
                : '...'}
            </Text.Body2>

            <Text.Body2>Shipping</Text.Body2>
            <Box></Box>
            <Text.Body2>
              {costSummary?.shipping
                ? formatDollarAmount(costSummary?.shipping)
                : '...'}
            </Text.Body2>

            <Text.Body2 fontWeight={500}>Estimated Total</Text.Body2>
            <Box></Box>
            <Text.Body2 fontWeight={500}>
              {costSummary?.total
                ? formatDollarAmount(costSummary.total)
                : '...'}
            </Text.Body2>
          </Box>
        </Box>
      </Form.Form>
    </Box>
  )
}

export default CheckoutStep
