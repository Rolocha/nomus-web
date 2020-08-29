import styled from '@emotion/styled'
import { animations, colors } from 'src/styles'

interface Props {
  width?: string
  height?: string
}

const Spinner = styled<'div', Props>('div')`
  width: ${(props: Props) => props?.width ?? '50px'};
  height: ${(props: Props) => props?.height ?? '50px'};
  border-radius: 50%;
  border: 4px solid transparent;
  border-top: 4px solid ${colors.nomusBlue};
  animation: ${animations.rotate360} 1s ease infinite;
`

export default Spinner
