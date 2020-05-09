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
  shadow,
  ShadowProps,
} from 'styled-system'

type BoxProps = { as?: string } & SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  ShadowProps

const Box = styled<'div', BoxProps>('div')(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  space,
  position,
  color,
  border,
  layout,
  flexbox,
  grid,
  shadow,
)

export default Box
