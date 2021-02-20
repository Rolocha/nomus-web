import styled from '@emotion/styled'
import * as React from 'react'
import { layout, position, space, system } from 'styled-system'
import IconLibrary from './library'
import { IconProps } from './types'

type IconType = keyof typeof IconLibrary

interface Props extends IconProps {
  of: IconType
}

const styledSystemProps = [
  system({
    transform: {
      property: 'transform',
    },
  }),
  space,
  position,
  layout,
]

const Icon = ({ of, ...iconProps }: Props) => {
  const SelectedIcon = IconLibrary[of]
  // Turn SelectedIcon into a styled component that has the styled-system props on it
  // for easier customization
  const StylableIcon = styled(SelectedIcon)<IconProps>(...styledSystemProps)
  return <StylableIcon {...iconProps} />
}

export default Icon
