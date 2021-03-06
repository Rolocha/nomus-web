import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React from 'react'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import buttonStyles from 'src/styles/components/button'
import Icon from './Icon'

export default {
  title: 'components/Button',
  component: Button,
  excludeStories: /.*Data$/,
  argTypes: {
    size: {
      description: 'The size of the button',
      control: {
        type: 'select',
        options: Object.keys(buttonStyles.sizes),
      },
    },
    variant: {
      description: 'The style of the button',
      control: {
        type: 'select',
        options: Object.keys(buttonStyles.variants),
      },
    },
  },
}

export const actionsData = {
  onClick: action('clicked'),
}

//👇 We create a “template” of how args map to rendering
const PrimaryTemplate: Story<React.ComponentProps<typeof Button>> = ({
  ...args
}) => <Button {...args} />

export const Primary = PrimaryTemplate.bind({})

Primary.args = {
  variant: 'primary',
  size: 'normal',
  children: 'Click me!',
}

export const AllVariants = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr 1fr"
      width="800px"
      gridColumnGap={2}
      gridRowGap={2}
    >
      {Object.keys(buttonStyles.variants).map((variant: any) =>
        (['normal', 'big'] as const).map((size) => (
          <Button m={1} key={variant + size} variant={variant} size={size}>
            {size} {variant}
          </Button>
        )),
      )}
    </Box>
  )
}

export const ButtonsInAGrid = () => {
  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="4fr 8fr"
        width="500px"
        gridColumnGap={2}
      >
        <Button>Button 1</Button>
        <Button variant="secondary">Button 2</Button>
      </Box>
    </>
  )
}

export const ButtonsWithIcons = () => {
  return (
    <>
      <Text.Body2>Left-side icon</Text.Body2>
      <Button
        leftIcon={
          <Icon
            of="chevronRight"
            transform="rotateZ(180deg)"
            color="white"
            boxSize="1.2em"
          />
        }
      >
        Previous
      </Button>
      <Text.Body2>Right-side icon</Text.Body2>
      <Button
        rightIcon={<Icon of="chevronRight" color="white" boxSize="1.2em" />}
      >
        Next
      </Button>
      <Text.Body2>
        Just an icon (use <code>{'<IconButton icon={...} />'}</code>)
      </Text.Body2>
    </>
  )
}

export const LoadingButton = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  return (
    <>
      <Box>
        <Text.Body2>
          A button with <code>isLoading</code>. Try submitting!
        </Text.Body2>
        <Button isLoading={isSubmitting} onClick={() => setIsSubmitting(true)}>
          Submit
        </Button>
      </Box>
      <Box>
        <Text.Body2>
          One with custom <code>loadingText</code>
        </Text.Body2>
        <Button
          isLoading={isSubmitting}
          loadingText="Submitting"
          onClick={() => setIsSubmitting(true)}
        >
          Submit
        </Button>
      </Box>
    </>
  )
}

export const OverrideButton = () => {
  return (
    <>
      <Box>
        <Text.Body2>
          A button demonstrating applying custom styles, e.g. a dashed border
          for the secondary variant
        </Text.Body2>
        <Button
          border={`1px dashed ${colors.nomusBlue}`}
          size="normal"
          variant="secondary"
          borderStyle="dashed"
          bg="white"
          color="nomusBlue"
          leftIcon={<Icon of="upload" color={colors.nomusBlue} />}
        >
          Upload a file or drag and drop
        </Button>
      </Box>
    </>
  )
}
