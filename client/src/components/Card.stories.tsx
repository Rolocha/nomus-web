import { Story } from '@storybook/react'
import React from 'react'
import Box from 'src/components/Box'
import Card from 'src/components/Card'
import * as SVG from 'src/components/SVG'
import { colors } from 'src/styles'

export default {
  title: 'components/Card',
  component: Card,
  excludeStories: /.*Data$/,
}

const PrimaryTemplate: Story<React.ComponentProps<typeof Card>> = ({
  ...args
}) => (
  <Box width="400px">
    <Card {...args} />
  </Box>
)

export const Primary = PrimaryTemplate.bind({})

Primary.args = {
  align: 'left',
  size: 'small',
  icon: <SVG.Smile1 />,
  header: '25 cards / $75',
  subheader: '$3 per card',
  bodyText: 'Just enough to get you started in the NFC business cards game.',
  topBarColor: colors.gold,
}

interface VariousLayoutsTemplateProps {
  icon: boolean
  subheader: boolean
  bodyText: boolean
}

const VariousLayoutsTemplate: Story<VariousLayoutsTemplateProps> = ({
  ...args
}) => {
  const makeCard = ({ size, align }: any) => (
    <Card
      header={[size, align].join('/')}
      size={size}
      align={align}
      subheader={args.subheader ? 'Some subheahder' : undefined}
      bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consectetur mattis diam eu consequat. Aliquam erat volutpat. Nunc sed urna vitae nisi feugiat vestibulum eu sit amet ante."
      icon={args.icon ? <SVG.Smile1 /> : undefined}
    />
  )

  return (
    <Box display="grid" gridTemplateColumns="repeat(3, 400px)" gridGap="16px">
      {makeCard({ size: 'medium', align: 'left' })}
      {makeCard({ size: 'medium', align: 'center' })}
      {makeCard({ size: 'medium', align: 'mix' })}

      {makeCard({ size: 'small', align: 'left' })}
      {makeCard({ size: 'small', align: 'center' })}
      {makeCard({ size: 'small', align: 'mix' })}
    </Box>
  )
}

export const VariousLayouts = VariousLayoutsTemplate.bind({})

VariousLayouts.args = {
  icon: true,
  subheader: true,
  bodyText: true,
}
