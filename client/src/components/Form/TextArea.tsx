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
  error?: any
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

const TextArea = styled.textarea<TextAreaProps>(
  {
    border: `1px solid ${theme.colors.africanElephant}`,
    borderRadius: '6px',
    padding: '12px',
    fontFamily: theme.fontFamilies.rubik,
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
  (props) =>
    props.error
      ? {
          border: `2px solid ${theme.colors.invalidRed}`,
        }
      : undefined,
)

TextArea.defaultProps = {
  ...theme.textStyles.input,
  lineHeight: 1.5,
}

export default TextArea
