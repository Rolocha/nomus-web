import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { Contact } from 'src/types/contact'
import { getFormattedFullDate } from 'src/utils/date'
import { formatName } from 'src/utils/name'
import ContactCardsList from './ContactCardsList'

interface ParamsType {
  usernameOrId: string
}

interface Props {
  selectedContactUsernameOrId?: string
  contacts: Contact[]
  searchQueryValue: string
}

const bp = 'lg'

const ContactsDetailView = ({
  selectedContactUsernameOrId,
  contacts,
  searchQueryValue,
}: Props) => {
  const selectedContact =
    selectedContactUsernameOrId != null
      ? contacts.find(
          (user) =>
            user.username === selectedContactUsernameOrId ||
            user.id === selectedContactUsernameOrId,
        ) ?? null
      : null
  return (
    <Box
      display="grid"
      maxHeight="500px"
      gridTemplateAreas={`
      "list selectedContact"
      `}
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      <Box
        gridArea="list"
        placeSelf="stretch"
        maxHeight="500px"
        overflow="auto"
      >
        <ContactCardsList
          contacts={contacts}
          selectedContactUsernameOrId={selectedContactUsernameOrId}
          searchQuery={searchQueryValue}
          viewMode="linear"
          groupBy="firstInitial"
          sortGroupsDirection="normal"
          sortBy="fullName"
          sortByDirection="normal"
        />
      </Box>
      {selectedContact && (
        <Box
          gridArea="selectedContact"
          p={3}
          display="grid"
          gridTemplateColumns={{
            _: '4fr 6fr 2fr',
            [bp]: '2fr 6fr',
          }}
          gridTemplateRows={{
            _: '',
            [bp]: 'auto 1fr',
          }}
          gridTemplateAreas={{
            _: `
            "profilePic keyInfo"
            "cards cards cards"
            "profileInfo profileInfo editProfile"
            "previewButton previewButton previewButton"
          `,
            [bp]: `
              "profilePic keyInfo"
              "cards bio"
              "notes notes"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
          overflowY="auto"
        >
          <Box gridArea="profilePic">
            <Image
              width="100%"
              borderRadius="50%"
              src={
                selectedContact.profilePicUrl ??
                'http://via.placeholder.com/500x300'
              }
            />
          </Box>

          <Box gridArea="keyInfo" alignSelf={{ _: 'start', md: 'center' }}>
            <Text.SectionHeader mb={1} mt={0}>
              {formatName(selectedContact.name)}
            </Text.SectionHeader>

            <Text.Body mb={3}>{selectedContact.headline}</Text.Body>

            <Box display="flex" flexDirection="row" mx={-3}>
              {selectedContact.phoneNumber && (
                <Box px={3}>
                  <Text.Label>Phone</Text.Label>
                  <Text.Body>{selectedContact.phoneNumber}</Text.Body>
                </Box>
              )}
              {selectedContact.email && (
                <Box px={3}>
                  <Text.Label>Email</Text.Label>
                  <Text.Body>{selectedContact.email}</Text.Body>
                </Box>
              )}
            </Box>
          </Box>

          {/* Front of business card */}
          {selectedContact.cardFrontImageUrl && (
            <Box gridArea="cards" width={{ _: '50%', [bp]: '100%' }} mb={2}>
              <Image width="100%" src={selectedContact.cardFrontImageUrl} />
            </Box>
          )}

          <Box gridArea="bio">
            <Text.Label>BIO</Text.Label>
            <Text.Body>{selectedContact.bio}</Text.Body>
          </Box>

          <Box gridArea="notes">
            <Text.SectionHeader mb={2}>Your notes</Text.SectionHeader>
            <Box display="flex" flexDirection="row" mx={-3} mb={2}>
              <Box px={3}>
                <Text.Label>Meeting Date</Text.Label>
                <Text.Body>
                  {selectedContact.meetingDate
                    ? getFormattedFullDate(selectedContact.meetingDate)
                    : ''}
                </Text.Body>
              </Box>

              <Box px={3}>
                <Text.Label>Meeting Place</Text.Label>
                <Text.Body>{selectedContact.meetingPlace ?? ''}</Text.Body>
              </Box>
            </Box>
            <Box>
              <Text.Label>Additional Notes</Text.Label>
              <Text.Body>{selectedContact.notes ?? ''}</Text.Body>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ContactsDetailView
