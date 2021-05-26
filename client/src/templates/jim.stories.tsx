import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { colors } from 'src/styles'
import { CardTemplateRenderOptions } from 'src/templates/base'

export default {
  title: 'Card Templates/Jim',
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const JimTemplateTemplate: Story<CardTemplateRenderOptions> = ({
  ...options
}) => {
  return (
    <Box display="flex">
      <Box mr={3}>
        <TemplateCard
          shadow
          width="400px"
          templateId="jim"
          side="front"
          options={options}
        />
      </Box>
      <Box>
        <TemplateCard
          shadow
          width="400px"
          templateId="jim"
          side="back"
          options={options}
        />
      </Box>
    </Box>
  )
}

export const Jim = JimTemplateTemplate.bind({})

const args: CardTemplateRenderOptions = {
  contactInfo: {
    name: 'Spongebob Squarepants',
    headline: 'Fry Cook at Krusty Krab',
    line1: 'The Krusty Krab',
    line2: '(555)-555-5555',
    line3: 'spongebob@krustykrab.com',
    footer: "I'm ready, I'm ready, I'm ready",
  },
  graphic: {
    url:
      'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
    size: 0.5,
  },
  colorScheme: {
    background: colors.white,
    accent: colors.viridianGreen,
    text: colors.midnightGray,
  },
  qrCodeUrl: 'https://nomus.me',
  omittedContactInfoFields: [],
}

Jim.args = args
