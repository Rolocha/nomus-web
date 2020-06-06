import styled from '@emotion/styled'
import theme from 'src/styles/theme'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  lineHeight,
  LineHeightProps,
  position,
  PositionProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'

type InputProps = {
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

const Input = styled<'input', InputProps>('input')(
  {
    borderRadius: '6px',
    padding: '4px 8px',
    border: `1px solid ${theme.colors.textOlive}`,
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

Input.defaultProps = {
  fontSize: theme.textStyles.body.fontSize,
  lineHeight: theme.textStyles.input.lineHeight,
}

export default Input
