import { css } from '@emotion/core'
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

const Icon = styled<'i', IconProps>('i')(
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
    css={css`
      ${size ? `--ggs: ${size};` : ''}
      ${color ? `color: ${color};` : ''}
    `}
    className={`gg-${icon}`}
  />
)

export default IconComponent
