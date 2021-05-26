import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { colors } from 'src/styles'
import { CardTemplateRenderOptions } from 'src/templates/base'

export default {
  title: 'Card Templates/KonaTall',
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const KonaTallTemplateTemplate: Story<CardTemplateRenderOptions> = ({
  ...options
}) => {
  return (
    <Box display="flex">
      <Box mr={3}>
        <TemplateCard
          shadow
          width="400px"
          templateId="konatall"
          side="front"
          options={options}
        />
      </Box>
      <Box>
        <TemplateCard
          shadow
          width="400px"
          templateId="konatall"
          side="back"
          options={options}
        />
      </Box>
    </Box>
  )
}

export const KonaTall = KonaTallTemplateTemplate.bind({})

const args: CardTemplateRenderOptions = {
  contactInfo: {
    name: 'Spongebob Squarepants',
    headline: 'Fry Cook at the Krusty Krab',
  },
  graphic: {
    url:
      'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
    size: 0.5,
  },
  colorScheme: {
    background: colors.white,
    text: colors.midnightGray,
  },
  qrCodeUrl: 'https://nomus.me',
  omittedContactInfoFields: [],
}

KonaTall.args = args
