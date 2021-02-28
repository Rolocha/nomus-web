import { chakra } from '@chakra-ui/system'
import { FieldError } from 'react-hook-form'
import theme from 'src/styles/theme'

interface Props extends React.ComponentProps<typeof chakra.input> {
  error?: FieldError | boolean
}

const Input = ({ error, ...props }: Props) => {
  return (
    <chakra.input
      borderRadius="6px"
      padding="10px 8px"
      border={
        error
          ? `2px solid ${theme.colors.invalidRed}`
          : `1px solid ${theme.colors.africanElephant}`
      }
      _placeholder={{
        color: theme.colors.africanElephant,
      }}
      {...props}
    />
  )
}

Input.defaultProps = {
  ...theme.textStyles.input,
}

export default Input
