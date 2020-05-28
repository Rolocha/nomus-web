import styled from '@emotion/styled'
import * as CSS from 'csstype'
import {
  border,
  BorderProps,
  layout,
  LayoutProps,
  position,
  PositionProps,
  RequiredTheme,
  ResponsiveValue,
  space,
  SpaceProps,
  system,
  TLengthStyledSystem,
} from 'styled-system'

type ImageProps = SpaceProps &
  PositionProps &
  BorderProps &
  LayoutProps & {
    h?: ResponsiveValue<CSS.HeightProperty<TLengthStyledSystem>, RequiredTheme>
    w?: ResponsiveValue<CSS.WidthProperty<TLengthStyledSystem>, RequiredTheme>
  }

const Image = styled<'img', ImageProps>('img')(
  space,
  position,
  border,
  layout,
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
