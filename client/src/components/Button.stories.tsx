import { css } from '@emotion/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import Button, { styleVariants } from 'src/components/Button'
import * as Form from 'src/components/Form'
import * as Text from 'src/components/Text'
import Icon from './Icon'

export default {
  title: 'Button',
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const AllVariants = () => {
  const [isDisabled, setIsDisabled] = React.useState(false)

  return (
    <Box>
      <Text.Body2>Disabled?</Text.Body2>
      <Form.Input
        type="checkbox"
        checked={isDisabled}
        onChange={(event) => setIsDisabled(event.target.checked)}
      />

      <Box display="grid" gridTemplateColumns="1fr 1fr">
        {Object.keys(styleVariants).map((variant: any) =>
          (['normal', 'big'] as const).map((size) => (
            <Button
              css={css`
                text-transform: capitalize;
                place-self: center;
              `}
              m={1}
              key={variant}
              variant={variant}
              size={size}
              disabled={isDisabled}
            >
              {size} {variant}
            </Button>
          )),
        )}
      </Box>
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

export const WithIcons = () => {
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
        Just an icon (you can use either leftIcon or rightIcon)
      </Text.Body2>
      <Button rightIcon={<Icon of="profile" color="white" boxSize="1.2em" />} />
      <Button leftIcon={<Icon of="profile" color="white" boxSize="1.2em" />} />
    </>
  )
}

export const LoadingButton = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  return (
    <>
      <Box>
        <Text.Body2>
          A button with <code>inProgress</code>. Try submitting!
        </Text.Body2>
        <Button inProgress={isSubmitting} onClick={() => setIsSubmitting(true)}>
          Submit
        </Button>
      </Box>
      <Box>
        <Text.Body2>
          One with custom <code>inProgressText</code>
        </Text.Body2>
        <Button
          inProgress={isSubmitting}
          inProgressText="Submitting"
          onClick={() => setIsSubmitting(true)}
        >
          Submit
        </Button>
      </Box>
      <Box>
        <Text.Body2>
          One with a <code>leftIcon</code>
        </Text.Body2>
        <Button
          leftIcon={<Icon of="profile" />}
          inProgress={isSubmitting}
          inProgressText="Submitting"
          onClick={() => setIsSubmitting(true)}
        >
          Submit
        </Button>
      </Box>
    </>
  )
}
