import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import Box from 'src/components/Box'
import TemplateCard from 'src/components/TemplateCard'
import { colors } from 'src/styles'
import { UserSpecifiedOptions } from 'src/templates/base'
import { VeliaContactFields, VeliaExtendedColors } from './velia'

export default {
  title: 'Card Templates/Velia',
  excludeStories: /.*Data$/,
  // argTypes: veliaTemplate.storybookArgTypes,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const VeliaTemplateTemplate: Story<
  UserSpecifiedOptions<VeliaContactFields, VeliaExtendedColors>
> = ({ ...options }) => {
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

const args: UserSpecifiedOptions<VeliaContactFields, VeliaExtendedColors> = {
  contactInfo: {
    name: 'Spongebob Squarepants',
    headline: 'Fry Cook at the Krusty Krab',
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
    background: colors.offWhite,
    accent: colors.gold,
    text: colors.midnightGray,
  },
}

Velia.args = args
