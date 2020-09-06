import styled from '@emotion/styled'
import { animations, colors } from 'src/styles'

interface Props {
  size?: string
}

const Spinner = styled<'div', Props>('div')`
  width: ${(props: Props) => props.size || '50px'};
  height: ${(props: Props) => props.size || '50px'};
  border-radius: 50%;
  border: calc(${(props) => props.size || '50px'} / 12.5) solid transparent;
  border-top: calc(${(props) => props.size || '50px'} / 12.5) solid
    ${colors.nomusBlue};
  animation: ${animations.rotate360} 1s ease infinite;
`

export default Spinner
