import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { colors } from 'src/styles'
import { CardTemplateRenderOptions } from 'src/templates/base'
import { RolochaContactFields, RolochaExtendedColors } from './rolocha'

export default {
  title: 'Card Templates/Rolocha',
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const RolochaTemplateTemplate: Story<
  CardTemplateRenderOptions<RolochaContactFields, RolochaExtendedColors>
> = ({ ...options }) => {
  return (
    <Box display="flex">
      <Box mr={3}>
        <TemplateCard
          shadow
          width="400px"
          templateId="rolocha"
          side="front"
          options={options}
        />
      </Box>
      <Box>
        <TemplateCard
          shadow
          width="400px"
          templateId="rolocha"
          side="back"
          options={options}
        />
      </Box>
    </Box>
  )
}

export const Rolocha = RolochaTemplateTemplate.bind({})

const args: CardTemplateRenderOptions<
  RolochaContactFields,
  RolochaExtendedColors
> = {
  contactInfo: {
    name: 'Spongebob Squarepants',
    headline: 'Fry Cook at the Krusty Krab',
    line1: 'The Krusty Krab',
    line2: '(555)-555-5555',
    line3: 'spongebob@krustykrab.com',
    line4: '1 Apple Park Road',
    footer: "I'm ready, I'm ready, I'm ready",
  },
  graphic: {
    url:
      'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
    size: 0.5,
  },
  colorScheme: {
    background: colors.offWhite,
    accent: colors.gold,
    text: colors.midnightGray,
  },
  qrCodeUrl: 'https://nomus.me',
  omittedContactInfoFields: [],
}

Rolocha.args = args
