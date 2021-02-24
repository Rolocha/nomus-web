import { css } from '@emotion/react'
import styled from '@emotion/styled'
import * as React from 'react'
import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  grid,
  GridProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
} from 'styled-system'

type IconProps = SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  ShadowProps

const Icon = styled.i<IconProps>(
  space,
  position,
  color,
  border,
  layout,
  flexbox,
  grid,
  shadow,
)

type IconComponentProps = IconProps & {
  icon: string
  size?: number
  color?: string
}

const IconComponent = ({ icon, color, size }: IconComponentProps) => (
  <Icon
    color={color}
    css={css`
      ${size ? `--ggs: ${size};` : ''}
    `}
    className={`gg-${icon}`}
  />
)

export default IconComponent
