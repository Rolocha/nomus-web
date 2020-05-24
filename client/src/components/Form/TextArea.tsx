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

type TextAreaProps = {
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

const TextArea = styled<'textarea', TextAreaProps>('textarea')(
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

TextArea.defaultProps = {
  fontSize: theme.textStyles.body.fontSize,
}

export default TextArea
