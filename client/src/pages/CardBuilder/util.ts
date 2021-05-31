import {
  CardBuilderState,
  initialStateOptions,
} from 'src/pages/CardBuilder/card-builder-state'
import { BaseType } from 'src/pages/CardBuilder/types'
import { colors } from 'src/styles'

export const sampleCardBuilderState: CardBuilderState = {
  ...initialStateOptions[BaseType.Template],
  cardVersionId: 'cardv_1234',
  baseType: BaseType.Template,
  templateId: 'nicole',
  templateCustomization: {
    contactInfo: {
      name: 'Spongebob Squarepants',
      headline: 'Fry Cook at the Krusty Krab',
      line1: 'The Krusty Krab',
      line2: '(555)-555-5555',
      line3: '(555)-555-5555',
      line4: '(555)-555-5555',
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
      accent2: colors.nomusBlue,
      text: colors.midnightGray,
    },
  },
  quantity: 100,
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
  submissionError: {
    message: 'The security code you entered is incorrect.',
    backlinkToStep: 'checkout',
  },
}
