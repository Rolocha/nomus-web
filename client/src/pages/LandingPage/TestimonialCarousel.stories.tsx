import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React from 'react'
import Box from 'src/components/Box'
import { colors } from 'src/styles'
import TestimonialCarousel from './TestimonialCarousel'

export default {
  title: 'components/TestimonialCarousel',
  component: TestimonialCarousel,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const PrimaryTemplate: Story<
  React.ComponentProps<typeof TestimonialCarousel>
> = ({ ...args }) => (
  <Box position="relative" bg={colors.ivory} p="16px">
    <TestimonialCarousel {...args} />
  </Box>
)

export const Primary = PrimaryTemplate.bind({})

Primary.args = {
  testimonials: [
    {
      authorName: 'Sunny Alessandro',
      authorHeadline: 'Director of Cool Company',
      authorImageSrc: 'http://placehold.it/300x300',
      quote:
        'This needs to be a short quote from one of our Alpha customers. It’s gotta just be a couple of sentences. Actually, I’m thinking it can actually be longer than that. I’d say maybe eight lines max. How’s that, punk?',
    },
    {
      authorName: 'Sunny Alessandro',
      authorHeadline: 'Director of Cool Company',
      authorImageSrc: 'http://placehold.it/300x300',
      quote:
        'This needs to be a short quote from one of our Alpha customers. It’s gotta just be a couple of sentences. Actually, I’m thinking it can actually be longer than that. I’d say maybe eight lines max. How’s that, punk?',
    },
    {
      authorName: 'Sunny Alessandro',
      authorHeadline: 'Director of Cool Company',
      authorImageSrc: 'http://placehold.it/300x300',
      quote:
        'This needs to be a short quote from one of our Alpha customers. It’s gotta just be a couple of sentences. Actually, I’m thinking it can actually be longer than that. I’d say maybe eight lines max. How’s that, punk?',
    },
  ],
}
