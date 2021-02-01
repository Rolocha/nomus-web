import { css } from '@emotion/react'
import * as React from 'react'
import * as Text from 'src/components/Text'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import contactsEmptyStateSvg from './contacts_empty_state.svg'

const ContactsEmptyState = () => {
  return (
    <Box
      display="grid"
      gridRowGap="16px"
      justifyItems="center"
      css={css({ textAlign: 'center', '&>*': { gridColumn: '2/3' } })}
    >
      <Image src={contactsEmptyStateSvg} />
      <Text.Body2 fontWeight={500}>No contacts found</Text.Body2>
      <Text.Body2>
        Darn. Try again with different search terms, and we’ll look extra hard.
      </Text.Body2>
    </Box>
  )
}

export default ContactsEmptyState
