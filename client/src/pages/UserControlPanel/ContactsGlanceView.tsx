import * as React from 'react'
import Box from 'src/components/Box'
import { Contact } from 'src/types/contact'
import ContactCardsList from './ContactCardsList'

interface Props {
  contacts: Contact[]
  searchQueryValue: string
}

const bp = 'md'

const ContactsGlanceView = ({ contacts, searchQueryValue }: Props) => {
  return (
    <Box maxHeight={{ _: undefined, [bp]: '500px' }} overflowY="auto">
      <ContactCardsList
        contacts={contacts}
        searchQuery={searchQueryValue}
        viewMode="grid"
        groupBy="meetingDate"
        sortGroupsDirection="reverse"
        sortBy="meetingDate"
        sortByDirection="reverse"
      />
    </Box>
  )
}

export default ContactsGlanceView
