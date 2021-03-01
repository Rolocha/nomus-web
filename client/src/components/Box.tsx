import { chakra, system } from '@chakra-ui/react'
import styled from '@emotion/styled'

interface BoxProps extends React.ComponentProps<typeof chakra.div> {}

type ContainerProp = {
  maxWidth: string
  minPadding: string
}

const isContainerPropBoolean = (cp: ContainerProp | boolean): cp is boolean =>
  typeof cp === 'boolean'

const Box = styled(chakra.div)<BoxProps>(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  // Define a custom 'container' prop that lets us easily make a box a "container" which
  // offers a max-width and min-padding so that the box is resilient to extreme widths
  system({
    container: {
      properties: ['paddingLeft', 'paddingRight'],
      transform: (value: BoxProps['container'], scale) => {
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
  }),
)

export default Box
