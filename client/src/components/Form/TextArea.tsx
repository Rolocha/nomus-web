import { chakra } from '@chakra-ui/system'
import styled from '@emotion/styled'
import theme from 'src/styles/theme'

interface TextAreaProps extends React.ComponentProps<typeof chakra.textarea> {
  error?: any
}

const TextArea = styled(chakra.textarea)<TextAreaProps>(
  {
    border: `1px solid ${theme.colors.africanElephant}`,
    borderRadius: '6px',
    padding: '12px',
    fontFamily: theme.fonts.rubik,
    fontWeight: 400,
  },
  (props) =>
    props.error
      ? {
          border: `2px solid ${theme.colors.invalidRed}`,
        }
      : undefined,
)

TextArea.defaultProps = {
  ...theme.textStyles.input,
  lineHeight: 1.5,
}

export default TextArea
