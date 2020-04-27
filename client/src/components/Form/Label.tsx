import styled from '@emotion/styled'

import theme from 'src/styles/theme'
import { LabelHTMLAttributes } from 'react'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

// @ts-ignore
const Label = styled<'label', LabelProps>('label')({
  ...theme.textStyles.label,
  textTransform: 'uppercase',
})

Label.defaultProps = {
  ...theme.textStyles.label,
}

export default Label
