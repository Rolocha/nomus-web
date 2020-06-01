import styled from '@emotion/styled'
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
  ResponsiveValue,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  system,
  ThemeValue,
} from 'styled-system'

type ContainerProp = {
  maxWidth: string
  minPadding: string
}

const isContainerPropBoolean = (cp: ContainerProp | Boolean): cp is Boolean =>
  typeof cp === 'boolean'

type BoxProps = {
  as?: string
  container?: ResponsiveValue<ThemeValue<'container', any>>
  placeSelf?: ResponsiveValue<ThemeValue<'placeSelf', any>>
} & SpaceProps &
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
  // Define a custom 'container' prop that lets us easily make a box a "container" which
  // offers a max-width and min-padding so that the box is resilient to extreme widths
  system({
    container: {
      properties: ['paddingLeft', 'paddingRight'],
      transform: (value: ContainerProp | Boolean, scale) => {
        if (value) {
          const maxWidth = isContainerPropBoolean(value)
            ? '1280px'
            : value.maxWidth
          const minPadding = isContainerPropBoolean(value)
            ? '15px'
            : value.minPadding
          return `max(calc((100vw - ${maxWidth}) / 2), ${minPadding})`
        }
      },
    },
    placeSelf: {
      property: 'placeSelf',
    },
  }),
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
