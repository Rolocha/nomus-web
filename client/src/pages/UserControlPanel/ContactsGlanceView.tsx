import * as React from 'react'
import Box from 'src/components/Box'
import { Contact } from 'src/types/contact'
import { ContactsSortOption } from './contact-sorting'
import ContactCardsList from './ContactCardsList'

interface Props {
  contacts: Contact[]
  selectedContactSortOption: ContactsSortOption
  searchQueryValue: string
}

const ContactsGlanceView = ({
  contacts,
  selectedContactSortOption,
  searchQueryValue,
}: Props) => {
  return (
    <Box maxHeight={{ _: undefined, lg: '500px' }} overflowY="auto">
      <ContactCardsList
        selectedContactSortOption={selectedContactSortOption}
        contacts={contacts}
        searchQuery={searchQueryValue}
        viewMode="grid"
      />
    </Box>
  )
}

export default ContactsGlanceView
