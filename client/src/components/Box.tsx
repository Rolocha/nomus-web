import { Box as ChakraBox } from '@chakra-ui/react'
import styled from '@emotion/styled'
import {
  BackgroundProps,
  BorderProps,
  ColorProps,
  FlexboxProps,
  grid,
  GridProps,
  LayoutProps,
  PositionProps,
  ResponsiveValue,
  ShadowProps,
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
  placeContent?: ResponsiveValue<ThemeValue<'placeContent', any>>
  justifySelf?: ResponsiveValue<ThemeValue<'justifySelf', any>>
  transform?: ResponsiveValue<ThemeValue<'transform', any>>
  cursor?: ResponsiveValue<ThemeValue<'cursor', any>>
  textAlign?: ResponsiveValue<ThemeValue<'textAlign', any>>
  transition?: ResponsiveValue<ThemeValue<'transition', any>>
} & SpaceProps &
  PositionProps &
  ColorProps &
  BorderProps &
  LayoutProps &
  FlexboxProps &
  GridProps &
  ShadowProps &
  BackgroundProps

const Box = styled(ChakraBox)<BoxProps>(
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
            ? '16px'
            : value.minPadding
          return `max(calc((100vw - ${maxWidth}) / 2), ${minPadding})`
        }
      },
    },
    placeSelf: {
      property: 'placeSelf',
    },
    placeContent: {
      property: 'placeContent',
    },
    justifySelf: {
      property: 'justifySelf',
    },
    transform: {
      property: 'transform',
    },
    cursor: {
      property: 'cursor',
    },
    textAlign: {
      property: 'textAlign',
    },
    transition: {
      property: 'transition',
    },
  }),
  grid,
)

export default Box
//
// export default ChakraBox
