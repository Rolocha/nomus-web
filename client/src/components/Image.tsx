import styled from '@emotion/styled'
import * as CSS from 'csstype'
import {
  background,
  BackgroundProps,
  border,
  BorderProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  RequiredTheme,
  ResponsiveValue,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  system,
  TLengthStyledSystem,
} from 'styled-system'

type ImageProps = SpaceProps &
  BackgroundProps &
  PositionProps &
  BorderProps &
  LayoutProps &
  ShadowProps & {
    h?: ResponsiveValue<CSS.Property.Height<TLengthStyledSystem>, RequiredTheme>
    w?: ResponsiveValue<CSS.Property.Width<TLengthStyledSystem>, RequiredTheme>
  }

const Image = styled.img<ImageProps>(
  shadow,
  space,
  position,
  border,
  layout,
  background,
  // Need to use 'w' and 'h' for width/height for Image components to avoid clashing with <img />'s width/height attributes
  system({
    w: {
      property: 'width',
      scale: 'sizes',
    },
    h: {
      property: 'height',
      scale: 'sizes',
    },
  }),
)

export default Image
