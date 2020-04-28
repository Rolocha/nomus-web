import styled from '@emotion/styled'

import { variant } from 'styled-system'
import Box from 'src/components/Box'

type ContainerProps = {
  variant?: 'default' | 'full' | 'fullVertical' | 'small'
} & React.ComponentProps<typeof Box>

const CONTAINER_MAX_WIDTH = '1280px'
const MIN_PADDING = '15px'

const Container = styled<typeof Box, ContainerProps>(Box)(
  variant({
    variants: {
      default: {
        paddingTop: '25px',
        paddingBottom: '25px',
        paddingLeft: `max(calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2), ${MIN_PADDING})`,
        paddingRight: `max(calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2), ${MIN_PADDING})`,
      },
      full: {
        padding: '25px 0 25px 0',
      },
      fullVertical: {
        padding: '0',
        paddingLeft: `calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2)`,
        paddingRight: `calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2)`,
      },
      small: {
        padding: '15px',
        paddingLeft: `calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2)`,
        paddingRight: `calc((100vw - ${CONTAINER_MAX_WIDTH}) / 2)`,
      },
    },
  }),
)

Container.defaultProps = {
  variant: 'default',
}

export default Container
