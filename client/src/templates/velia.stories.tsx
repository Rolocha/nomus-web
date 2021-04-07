import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { colors } from 'src/styles'

import veliaTemplate, { VeliaOptions } from './velia'

export default {
  title: 'Card Templates/Velia',
  excludeStories: /.*Data$/,
  argTypes: veliaTemplate.storybookArgTypes,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const VeliaTemplateTemplate: Story<VeliaOptions> = ({ ...options }) => {
  return (
    <Box display="flex">
      <Box mr={3}>
        <TemplateCard
          shadow
          width="400px"
          templateId="velia"
          side="front"
          options={options}
        />
      </Box>
      <Box>
        <TemplateCard
          shadow
          width="400px"
          templateId="velia"
          side="back"
          options={options}
        />
      </Box>
    </Box>
  )
}

export const Velia = VeliaTemplateTemplate.bind({})

Velia.args = {
  name: 'Spongebob Squarepants',
  headline: 'Fry Cook at the Krusty Krab',
  line1: 'The Krusty Krab',
  line2: '(555)-555-5555',
  line3: 'spongebob@krustykrab.com',
  footer: "I'm ready, I'm ready, I'm ready",
  qrUrl: 'https://google.com',
  logoUrl:
    'https://static.wikia.nocookie.net/spongebob/images/6/65/Krabby_Patty_stock_art.png',
  logoSize: 0.5,
  backgroundColor: colors.offWhite,
  accentColor: colors.gold,
  textColor: colors.midnightGray,
}
