import { css } from '@emotion/core'
import { action } from '@storybook/addon-actions'
import React from 'react'
import Box from 'src/components/Box'
import Button, { styleVariants } from 'src/components/Button'
import * as Text from 'src/components/Text'

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
                <Text.Body fontWeight="bold">{variant}</Text.Body>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combinatorics.map((combinatoric) => (
            <tr>
              <td css={cellStyles}>
                <Text.Body>
                  {[
                    combinatoric.size,
                    combinatoric.enabled ? 'Enabled' : 'Disabled',
                  ].join(' ')}
                </Text.Body>
              </td>
              {Object.keys(styleVariants).map((variant) => (
                <td css={cellStyles}>
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
