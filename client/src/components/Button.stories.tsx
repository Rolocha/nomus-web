import React from 'react'
import { css } from '@emotion/core'
import { action } from '@storybook/addon-actions'

import { SectionHeader } from 'src/components/Text'
import Box from 'src/components/Box'
import Button, { styleVariants } from 'src/components/Button'

export default {
  title: 'Button',
  component: Button,
  excludeStories: /.*Data$/,
}

export const actionsData = {
  onClick: action('clicked'),
}

export const AllVariants = () => {
  const allVariants = Object.keys(
    styleVariants,
  ) as (keyof typeof styleVariants)[]
  const solidVariants = allVariants.filter((v) => !v.includes('Outline'))
  const outlineVariants = allVariants.filter((v) => v.includes('Outline'))

  const renderButton = (variant: keyof typeof styleVariants) => (
    <Button
      css={css`
        text-transform: capitalize;
      `}
      m={1}
      key={variant}
      variant={variant}
    >
      {variant
        .split(/(?=[A-Z])/)
        .map((s) => s.toLowerCase())
        .join(' ')}
    </Button>
  )

  return (
    <Box>
      <Box>
        <SectionHeader>Solid Variants</SectionHeader>
        {solidVariants.map(renderButton)}
      </Box>
      <Box>
        <SectionHeader>Outline Variants</SectionHeader>
        {outlineVariants.map(renderButton)}
      </Box>
    </Box>
  )
}
