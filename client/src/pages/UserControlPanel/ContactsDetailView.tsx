import * as React from 'react'
import { useParams } from 'react-router-dom'
import Box from 'src/components/Box'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import ContactCardsList from './ContactCardsList'

interface ParamsType {
  usernameOrId: string
}

interface Props {
  contacts: Contact[]
  searchQueryValue: string
}

const ContactsDetailView = ({ contacts, searchQueryValue }: Props) => {
  const params = useParams<ParamsType>()

  return (
    <Box
      display="grid"
      gridTemplateAreas={`
      "list selectedContact"
      `}
      gridTemplateColumns="1fr 3fr"
    >
      <Box
        gridArea="list"
        maxHeight="500px"
        overflow="auto"
        pr={2}
        borderRight={`1px solid ${colors.superlightGray}`}
      >
        <ContactCardsList
          contacts={contacts}
          searchQuery={searchQueryValue}
          viewMode="linear"
          groupBy="firstInitial"
          sortGroupsDirection="normal"
          sortBy="fullName"
          sortByDirection="normal"
        />
      </Box>
      <Box gridArea="selectedContact" p={3}>
        Detail view for {params.usernameOrId}
      </Box>
    </Box>
  )
}

export default ContactsDetailView
