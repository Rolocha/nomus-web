import * as React from 'react'
import styled from '@emotion/styled'
import { variant } from 'styled-system'

import theme from 'src/styles/theme'
import { LabelHTMLAttributes } from 'react'
import { colors } from 'src/styles'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  variant?: keyof typeof theme.textStyles | null
  required?: boolean
}

// @ts-ignore
const Label = styled<'label', LabelProps>('label')(
  {
    textTransform: 'uppercase',
    display: 'block',
  },
  variant({
    variants: theme.textStyles,
  }),
  (props) =>
    props.required
      ? {
          '::after': {
            content: '"*"',
            marginLeft: '2px',
            color: colors.invalidRed,
          },
        }
      : undefined,
)

Label.defaultProps = {
  variant: 'label',
}

export default Label
