import * as React from 'react'
import Box from 'src/components/Box'
import { Contact } from 'src/types/contact'
import ContactCardsList from './ContactCardsList'

interface Props {
  contacts: Contact[]
  searchQueryValue: string
}

const ContactsGlanceView = ({ contacts, searchQueryValue }: Props) => {
  return (
    <Box maxHeight="500px" overflow="auto">
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
