import { css } from '@emotion/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import Button, { styleVariants } from 'src/components/Button'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
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
  const renderButton = (
    variant: any,
    enabled: boolean,
    size: 'normal' | 'big',
  ) => (
    <Button
      css={css`
        text-transform: capitalize;
      `}
      m={1}
      key={variant}
      variant={variant}
      size={size}
      disabled={!enabled}
    >
      {variant}
    </Button>
  )

  const combinatorics: Array<{ enabled: boolean; size: 'big' | 'normal' }> = [
    { enabled: true, size: 'normal' },
    { enabled: false, size: 'normal' },
    { enabled: true, size: 'big' },
    { enabled: false, size: 'big' },
  ]

  const cellStyles = css({
    textAlign: 'center',
    textTransform: 'capitalize',
  })

  return (
    <Box>
      <table>
        <thead>
          <tr>
            <th />
            {Object.keys(styleVariants).map((variant) => (
              <th css={cellStyles}>
                <Text.Body2 fontWeight="bold">{variant}</Text.Body2>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combinatorics.map((combinatoric) => (
            <tr>
              <td css={cellStyles}>
                <Text.Body2>
                  {[
                    combinatoric.size,
                    combinatoric.enabled ? '[enabled]' : '[disabled]',
                  ].join(' ')}
                </Text.Body2>
              </td>
              {Object.keys(styleVariants).map((variant) => (
                <td
                  css={css(cellStyles, {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  })}
                >
                  {renderButton(
                    variant,
                    combinatoric.enabled,
                    combinatoric.size,
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
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
      <Text.Body2>
        Some examples of left-side icon and right-side icons.
      </Text.Body2>
      <Box
        display="flex"
        maxWidth="500px"
        justifyContent="space-between"
        p={3}
        borderRadius={3}
        border={`1px solid ${colors.lightGray}`}
      >
        <Button
          leftIcon={
            <Icon
              of="chevronRight"
              transform="rotateY(180deg)"
              color="white"
              boxSize="1.2em"
            />
          }
        >
          Previous
        </Button>
        <Button
          rightIcon={<Icon of="chevronRight" color="white" boxSize="1.2em" />}
        >
          Next
        </Button>
      </Box>
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
