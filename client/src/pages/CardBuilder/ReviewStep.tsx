import { css } from '@emotion/core'
import * as React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import * as Text from 'src/components/Text'
import { WizardStepProps } from 'src/components/Wizard'
import { colors } from 'src/styles'
import { formatDollarAmount } from 'src/utils/money'
import EditButton from 'src/components/EditButton'
import { getCostSummary } from 'src/utils/pricing'
import { BaseType, CardBuilderState } from './reducer'

interface Props {
  cardBuilderState: CardBuilderState
  handleOrderSubmit: () => Promise<void>
}

const ReviewStep = React.forwardRef(
  ({ cardBuilderState, handleOrderSubmit }: Props, ref) => {
    // Expose to the parent Wizard what to do on next/previous button clicks
    React.useImperativeHandle<any, WizardStepProps>(
      ref,
      () => ({
        onTransitionToNextStep: async () => {
          await handleOrderSubmit()
        },
      }),
      [handleOrderSubmit],
    )

    const frontImageDataUrl = cardBuilderState.frontDesignFile?.url
    const backImageDataUrl = cardBuilderState.backDesignFile?.url

    const associatedInfoOptions: Record<BaseType, Array<[string, string]>> = {
      custom: [
        [
          'Front design file',
          cardBuilderState.frontDesignFile?.file.name ?? 'None',
        ],
        [
          'Back design file',
          cardBuilderState.backDesignFile?.file.name ?? 'None',
        ],
      ],
      template: [['Foo', 'bar']],
    }

    const associatedInfo = associatedInfoOptions[cardBuilderState.baseType]

    const costSummary = getCostSummary(cardBuilderState.quantity)

    return (
      <Box height="100%" overflowY="scroll" p={{ _: '24px', md: '48px' }}>
        <Text.SectionHeader mb="24px">Your card design</Text.SectionHeader>
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 4fr)"
          gridColumnGap={3}
        >
          {frontImageDataUrl && (
            <BusinessCardImage width="100%" frontImageUrl={frontImageDataUrl} />
          )}
          {backImageDataUrl && (
            <BusinessCardImage width="100%" backImageUrl={backImageDataUrl} />
          )}
          <Box>
            <Text.SectionSubheader>
              Associated information
            </Text.SectionSubheader>
            <Box display="grid" gridTemplateColumns="2fr 2fr" gridRowGap={2}>
              {associatedInfo.map((item) => [
                <Text.Body2>{item[0]}</Text.Body2>,
                <Text.Body2>{item[1]}</Text.Body2>,
              ])}
            </Box>
          </Box>
        </Box>

        <Text.SectionHeader mt={4} mb="24px">
          Order summary
        </Text.SectionHeader>

        <Box
          display="grid"
          gridTemplateColumns="7fr 1fr 4fr"
          gridTemplateAreas={{
            md: `
        "detailSummary1 . costSummary"
        "detailSummary2 . costSummary"
      `,
          }}
        >
          <Box
            gridArea="detailSummary1"
            display="grid"
            gridTemplateColumns="3fr 2fr 1fr 1fr"
            placeSelf="start stretch"
            pb={4}
            borderBottom={`1px solid ${colors.africanElephant}`}
          >
            <Box>
              <Text.Body2 fontWeight="500">Item</Text.Body2>
              <Text.Body2>Nomus Velia template card</Text.Body2>
            </Box>

            <Box>
              <Text.Body2 fontWeight="500">Quantity</Text.Body2>
              <Text.Body2>{cardBuilderState.quantity} cards</Text.Body2>
            </Box>

            <Box>
              <Text.Body2 fontWeight="500">Price</Text.Body2>
              <Text.Body2>
                {costSummary?.subtotal
                  ? formatDollarAmount(costSummary?.subtotal)
                  : '...'}
              </Text.Body2>
            </Box>

            <Box>
              <EditButton />
            </Box>
          </Box>

          <Box
            pt={4}
            gridArea="detailSummary2"
            display="grid"
            gridTemplateColumns="3fr 3fr 1fr"
            placeSelf="start stretch"
            justifyItems="start"
            gridRowGap={3}
          >
            {/* next row */}
            <Text.Body2>Shipping info</Text.Body2>
            <Box>
              {[
                cardBuilderState.formData?.addressLine1,
                cardBuilderState.formData?.addressLine2,
                `${cardBuilderState.formData?.city}, ${cardBuilderState.formData?.state} ${cardBuilderState.formData?.postalCode}`,
              ]
                .filter(Boolean)
                .map((line) => (
                  <Text.Body2>{line}</Text.Body2>
                ))}
            </Box>
            <Box>
              <EditButton />
            </Box>

            {/* next row */}
            <Text.Body2>Delivery ETA</Text.Body2>
            <Box>
              <Text.Body2>TODO</Text.Body2>
            </Box>
            <Box>
              <EditButton />
            </Box>

            {/* next row */}
            <Text.Body2>Payment</Text.Body2>
            <Box>
              {[
                `${cardBuilderState?.stripeToken?.card?.brand} ${cardBuilderState?.stripeToken?.card?.funding} card`,
                `**** **** **** ${cardBuilderState?.stripeToken?.card?.last4}`,
                `${cardBuilderState?.stripeToken?.card?.address_zip}`,
              ].map((line) => (
                <Text.Body2>{line}</Text.Body2>
              ))}
            </Box>
            <Box>
              <EditButton />
            </Box>
          </Box>
          <Box
            gridArea="costSummary"
            width="100%"
            boxShadow="workingWindow"
            borderRadius={2}
            placeSelf="end end"
            p={4}
            display="grid"
            gridTemplateColumns="2fr 1fr 1fr"
            css={css`
              & > *:nth-child(3n) {
                place-self: center end;
              }
            `}
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
            <Text.Body2>{formatDollarAmount(500)}</Text.Body2>

            <Text.Body2 fontWeight={500}>Estimated Total</Text.Body2>
            <Box></Box>
            <Text.Body2 fontWeight={500}>
              {costSummary?.total
                ? formatDollarAmount(costSummary.total)
                : '...'}
            </Text.Body2>
          </Box>
        </Box>
      </Box>
    )
  },
)

export default ReviewStep
