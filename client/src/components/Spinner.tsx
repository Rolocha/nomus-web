import styled from '@emotion/styled'
import { animations, colors } from 'src/styles'

interface Props {
  size?: number
}

const Spinner = styled<'div', Props>('div')`
  width: ${(props: Props) => props.size || 50}px;
  height: ${(props: Props) => props.size || 50}px;
  border-radius: 50%;
  border: ${(props) => (props.size || 50) / 12.5}px solid transparent;
  border-top: ${(props) => (props.size || 50) / 12.5}px solid
    ${colors.nomusBlue};
  animation: ${animations.rotate360} 1s ease infinite;
`

export default Spinner
