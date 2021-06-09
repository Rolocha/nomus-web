import * as stripeJs from '@stripe/stripe-js'
import * as React from 'react'
import { UseFormMethods } from 'react-hook-form'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import CreditCardInput from 'src/components/CreditCardInput'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import PricingTiers from 'src/components/PricingTiers'
import * as Text from 'src/components/Text'
import CostSummary from 'src/pages/CardBuilder/CostSummary'
import { colors } from 'src/styles'
import { createMailtoURL } from 'src/utils/email'
import { CardBuilderAction, CardBuilderState } from './card-builder-state'

interface Props {
  cardBuilderState: CardBuilderState
  updateCardBuilderState: React.Dispatch<CardBuilderAction>
  checkoutFormMethods: UseFormMethods<any>
}

const CheckoutStep = ({
  cardBuilderState,
  updateCardBuilderState,
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

  const clearEnteredCardInformation = () => {
    const nextCBState: Partial<CardBuilderState> = {
      stripeToken: null,
      cardEntryComplete: false,
    }
    if (cardBuilderState.submissionError?.field === 'cardDetails') {
      nextCBState.submissionError = null
    }
    updateCardBuilderState(nextCBState)
  }
  
  const formValues = checkoutFormMethods.getValues()

  return (
    <Box height="100%">
      <Text.SectionHeader mb="24px">Order details</Text.SectionHeader>
      <Text.SectionSubheader mb={2}>
        How many cards do you want?
      </Text.SectionSubheader>
      <PricingTiers
        isSelectable
        selectedQuantity={cardBuilderState.quantity}
        onChangeSelectedQuantity={(quantity) =>
          updateCardBuilderState({
            quantity,
          })
        }
      />
      <Box display="flex" justifyContent="flex-end">
        <Link
          to={createMailtoURL({
            to: 'hi@nomus.me',
            subject: 'Large Card Order',
            body: `I'd like to put in a large order!\n(Put Details of your order here)`.trim(),
          })}
        >
          <Text.Body2 color="inherit">
            Need more than 100? Let us know.
          </Text.Body2>
        </Link>
      </Box>

      <Box mt="32px">
        <Form.Form>
          <Text.SectionSubheader mb="8px">
            Shipping & payment information
          </Text.SectionSubheader>
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', lg: '6fr 2fr 4fr' }}
            gridTemplateAreas={{
              base: `
            "formFields"
            "costSummary"
            `,
              lg: `
            "formFields . costSummary"
            `,
            }}
            overflow="visible"
            gridRowGap={{ base: '16px', lg: 0 }}
            pr={2}
          >
            {/* Form fields */}
            <Box gridArea="formFields">
              <Box
                display="grid"
                gridTemplateColumns={{ base: '4fr 8fr', lg: '3fr 1fr 2fr' }}
                gridTemplateAreas={{
                  base: `
                "name       name"
                "line1      line1"
                "line2      line2"
                "city       city"
                "state      zip"
                "cardNumber cardNumber"
                `,
                  lg: `
                "name name name"
                "line1 line1 line1"
                "line2 line2 line2"
                "city state zip"
                "cardNumber cardNumber cardNumber"
                `,
                }}
                gridColumnGap={3}
                gridRowGap={3}
                justifyItems="stretch"
              >
                <Box gridArea="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Input
                    name="name"
                    ref={checkoutFormMethods.register}
                    width="100%"
                  />
                </Box>
                <Box gridArea="line1">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Input
                    name="addressLine1"
                    ref={checkoutFormMethods.register}
                    width="100%"
                  />
                </Box>
                <Box gridArea="line2">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Input
                    name="addressLine2"
                    ref={checkoutFormMethods.register}
                    width="100%"
                  />
                </Box>
                <Box gridArea="city">
                  <Form.Label>City</Form.Label>
                  <Form.Input
                    name="city"
                    ref={checkoutFormMethods.register}
                    width="100%"
                  />
                </Box>
                <Box gridArea="state">
                  <Form.Label>State</Form.Label>
                  <Form.Input
                    name="state"
                    ref={checkoutFormMethods.register}
                    width="100%"
                    error={checkoutFormMethods.errors.state}
                    maxLength={2}
                    sx={{ textTransform: 'uppercase' }}
                  />
                  <Form.FieldError
                    fieldError={checkoutFormMethods.errors.state}
                  />
                </Box>
                <Box gridArea="zip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Input
                    name="postalCode"
                    ref={checkoutFormMethods.register}
                    width="100%"
                    error={checkoutFormMethods.errors.postalCode}
                    maxLength={5}
                  />
                  <Form.FieldError
                    fieldError={checkoutFormMethods.errors.postalCode}
                  />
                </Box>
                <Box gridArea="cardNumber">
                  <Form.Label htmlFor="card-element">
                    Credit or debit card
                  </Form.Label>
                  {cardBuilderState.stripeToken ? (
                    <Box
                      display="flex"
                      width="100%"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Text.Body2>
                        {`${cardBuilderState?.stripeToken?.card?.brand} ${cardBuilderState?.stripeToken?.card?.funding} card ending in ${cardBuilderState?.stripeToken?.card?.last4}`}
                      </Text.Body2>

                      <Button
                        variant="tertiary"
                        leftIcon={<Icon of="pen" />}
                        color={colors.nomusBlue}
                        onClick={clearEnteredCardInformation}
                        py={0}
                      >
                        Edit
                      </Button>
                    </Box>
                  ) : (
                    <CreditCardInput
                      id="card-element"
                      handleChange={handleCardInputChange}
                      postalCode={formValues.postalCode}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Cost summary */}
            <Box gridArea="costSummary" placeSelf="end end" width="100%">
              <CostSummary
                quantity={cardBuilderState.quantity}
                state={formValues.state}
              />
            </Box>
          </Box>
        </Form.Form>
      </Box>
    </Box>
  )
}

export default CheckoutStep
