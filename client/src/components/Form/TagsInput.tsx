import { css } from '@emotion/core'
import * as React from 'react'
import ReactTagsInput from 'react-tagsinput'
import Box from '../Box'

type Props = React.ComponentProps<typeof ReactTagsInput>

const TagsInput = ({ ...props }: Props) => {
  return (
    <Box css={css``}>
      <ReactTagsInput {...props} />
    </Box>
  )
}

export default TagsInput
