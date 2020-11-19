import * as React from 'react'
import Box from 'src/components/Box'
import { Contact } from 'src/types/contact'
import { ContactsSortOption } from './utils'
import ContactCardsList from './ContactCardsList'

interface Props {
  contacts: Contact[]
  selectedContactSortOption: ContactsSortOption
}

const bp = 'md'

const ContactsGlanceView = ({ contacts, selectedContactSortOption }: Props) => {
  return (
    <Box maxHeight={{ _: undefined, [bp]: '500px' }} overflowY="auto">
      <ContactCardsList
        selectedContactSortOption={selectedContactSortOption}
        contacts={contacts}
        viewMode="grid"
      />
    </Box>
  )
}

export default ContactsGlanceView
