import styled from '@emotion/styled'

import {
  space,
  SpaceProps,
  position,
  PositionProps,
  border,
  BorderProps,
  layout,
  LayoutProps,
} from 'styled-system'

type ImageProps = SpaceProps & PositionProps & BorderProps & LayoutProps

const Image = styled<'img', ImageProps>('img')(space, position, border, layout)

export default Image
