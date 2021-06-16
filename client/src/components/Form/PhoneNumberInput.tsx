import { chakra } from '@chakra-ui/system'
import { FieldError } from 'react-hook-form'
import _PhoneInput from 'react-phone-number-input/input'
import PhoneInputClass from 'react-phone-number-input'
import theme from 'src/styles/theme'

const PhoneInput = _PhoneInput as typeof PhoneInputClass

interface Props {
  // E.164 string value
  // See https://en.wikipedia.org/wiki/E.164
  value: string
  onChange: (newValue: string) => void
  onBlur?: () => void
  name?: string
  error?: FieldError | boolean
  width?: string
}

const PhoneNumberInput = ({
  value,
  onChange,
  onBlur,
  name,
  error,
  width,
}: Props) => {
  // react-phone-number-input sets an empty number to undefined
  // but we prefer an empty string
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue ?? '')
  }

  return (
    <chakra.span
      sx={{
        input: {
          width,
          ...theme.textStyles.input,
          borderRadius: '6px',
          padding: '10px 8px',
          border: error
            ? `2px solid ${theme.colors.invalidRed}`
            : `1px solid ${theme.colors.africanElephant}`,
          _placeholder: {
            color: theme.colors.africanElephant,
          },
        },
      }}
    >
      <PhoneInput
        name={name}
        country="US"
        placeholder="(555) 123-1234"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
      />
    </chakra.span>
  )
}

export default PhoneNumberInput
