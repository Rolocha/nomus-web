import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Box from 'src/components/Box'
import {
  cardBuilderReducer,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import { BaseType } from 'src/pages/CardBuilder/types'
import TemplateBuildStep from 'src/pages/CardBuilder/TemplateBuildStep'
import { colors } from 'src/styles'

export default {
  title: 'components/CardBuilder/TemplateBuildStep',
  component: TemplateBuildStep,
  excludeStories: /.*Data$/,
  decorators: [
    (Story: any) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
}

export const actionsData = {
  onClick: action('clicked'),
}

export const Primary = () => {
  const [cardBuilderState, updateCardBuilderState] = React.useReducer(
    cardBuilderReducer,
    {
      ...initialStateOptions[BaseType.Template],
      cardVersionId: 'cardv_1234',
      baseType: BaseType.Template,
      templateId: 'velia',
      templateCustomization: {
        contactInfo: {
          name: 'Spongebob Squarepants',
          headline: 'Fry Cook at the Krusty Krab',
          line1: 'The Krusty Krab',
          line2: '(555)-555-5555',
          footer: "I'm ready, I'm ready, I'm ready",
        },
        graphic: {
          file: {
            url:
              'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
          },
          size: 1,
        },
        colorScheme: {
          background: colors.offWhite,
          accent: colors.gold,
          text: colors.midnightGray,
        },
      },
      quantity: 50,
      formData: {
        name: 'Spongebob',
        addressLine1: '123 Pineapple St',
        city: 'Bikini Bottom',
        state: 'UW',
        postalCode: '12345',
      },
      stripeToken: {
        card: {
          id: 'idk',
          brand: 'Visa',
          funding: 'credit',
          last4: '4242',
          // eslint-disable-next-line
          address_zip: '94115',
        },
      } as any,
    },
  )

  return (
    <Box maxWidth="1200px" border="1px solid #eee" p={4}>
      <TemplateBuildStep
        cardBuilderState={cardBuilderState}
        updateCardBuilderState={updateCardBuilderState}
      />
    </Box>
  )
}
