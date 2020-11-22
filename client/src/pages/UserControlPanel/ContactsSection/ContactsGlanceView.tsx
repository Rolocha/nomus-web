import * as React from 'react'
import Box from 'src/components/Box'
import { Contact } from 'src/types/contact'
import { ContactsSortOption } from './utils'
import ContactCardsList from './ContactCardsList'
import ContactsEmptyState from './ContactsEmptyState'

interface Props {
  contacts: Contact[]
  selectedContactSortOption: ContactsSortOption
}

const bp = 'md'

const ContactsGlanceView = ({ contacts, selectedContactSortOption }: Props) => {
  return (
    <Box maxHeight={{ _: undefined, [bp]: '500px' }} overflowY="auto">
      {contacts.length === 0 ? (
        <Box
          py="70px"
          display="grid"
          width="100%"
          gridTemplateColumns={{ _: '1fr 10fr 1fr', [bp]: '4fr 4fr 4fr' }}
        >
          <Box />
          <ContactsEmptyState />
          <Box />
        </Box>
      ) : (
        <ContactCardsList
          selectedContactSortOption={selectedContactSortOption}
          contacts={contacts}
          viewMode="grid"
        />
      )}
    </Box>
  )
}

export default ContactsGlanceView
