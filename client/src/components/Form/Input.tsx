import * as React from 'react'
import styled from '@emotion/styled'
import {
  space,
  SpaceProps,
  position,
  PositionProps,
  color,
  ColorProps,
  border,
  BorderProps,
  layout,
  LayoutProps,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  fontSize,
  FontSizeProps,
  lineHeight,
  LineHeightProps,
  typography,
  TypographyProps,
} from 'styled-system'

import Box from 'src/components/Box'
import Label from './Label'
import theme from 'src/styles/theme'

type InputElementProps = {
  as?: string
} & SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  FontSizeProps &
  LineHeightProps &
  TypographyProps

const InputElement = styled<'input', InputElementProps>('input')(
  {
    boxShadow: 'inset 0px 0px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '6px',
    padding: '12px',
    border: 'none',
    fontFamily: theme.textStyles.body.fontFamily,
    fontWeight: 400,
  },
  space,
  position,
  color,
  border,
  layout,
  flexbox,
  grid,
  fontSize,
  lineHeight,
  typography,
)

InputElement.defaultProps = {
  fontSize: theme.textStyles.input.fontSize,
  lineHeight: theme.textStyles.input.lineHeight,
}

interface InputProps extends React.ComponentProps<typeof InputElement> {
  name?: string
  label?: string
  autocomplete?: string
}

const Input = React.forwardRef(
  (
    { name, label, as, ...inputProps }: InputProps,
    ref: React.Ref<HTMLInputElement>,
  ) =>
    label ? (
      <Box display="flex" flexDirection="column">
        <Label htmlFor={name}>{label}</Label>
        <InputElement ref={ref} name={name} {...inputProps} />
      </Box>
    ) : (
      <InputElement ref={ref} name={name} {...inputProps} />
    ),
)

export default Input
