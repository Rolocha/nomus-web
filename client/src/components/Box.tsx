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
} from 'styled-system'

type BoxProps = { as?: string } & SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps

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
)

export default Box
