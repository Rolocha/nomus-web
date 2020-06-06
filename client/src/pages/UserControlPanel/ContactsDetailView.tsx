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

const bp = 'md'

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
      display={{ _: undefined, [bp]: 'grid' }}
      maxHeight={{ _: undefined, [bp]: '500px' }}
      gridTemplateAreas={{
        _: undefined,
        [bp]: `
      "list selectedContact"
      `,
      }}
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      <Box
        display={{
          _: selectedContactUsernameOrId ? 'none' : 'block',
          [bp]: 'block',
        }}
        gridArea="list"
        placeSelf="stretch"
        maxHeight="inherit"
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
          p={{ _: 1, [bp]: 3 }}
          display="grid"
          gridTemplateColumns={{
            _: '4fr 8fr',
            [bp]: '2fr 6fr',
          }}
          // gridTemplateRows={{
          //   _: '',
          //   [bp]: 'auto 1fr',
          // }}
          gridTemplateAreas={{
            _: `
            "profilePic nameplate"
            "cards cards"
            "contactInfo contactInfo"
            "bio bio"
            "notes notes"
          `,
            [bp]: `
              "profilePic nameplate"
              "profilePic contactInfo"
              "cards bio"
              "notes notes"
            `,
          }}
          gridColumnGap={3}
          gridRowGap={3}
          maxHeight="inherit"
          overflowX="hidden"
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

          <Box gridArea="nameplate" alignSelf={{ _: 'start', md: 'center' }}>
            <Text.SectionHeader mb={1} mt={0}>
              {formatName(selectedContact.name)}
            </Text.SectionHeader>
            <Text.Body>{selectedContact.headline}</Text.Body>
          </Box>
          <Box
            gridArea="contactInfo"
            alignSelf="start"
            display="flex"
            flexDirection="row"
            mx={-3}
          >
            {selectedContact.email && (
              <Box px={3}>
                <Text.Label>Email</Text.Label>
                <Text.Body>{selectedContact.email}</Text.Body>
              </Box>
            )}
            {selectedContact.phoneNumber && (
              <Box px={3}>
                <Text.Label>Phone Number</Text.Label>
                <Text.Body>{selectedContact.phoneNumber}</Text.Body>
              </Box>
            )}
          </Box>

          {(selectedContact.cardFrontImageUrl ||
            selectedContact.cardBackImageUrl) && (
            <Box
              gridArea="cards"
              width={{ _: '100%', [bp]: '100%' }}
              mx={{ _: -1, [bp]: 0 }}
              my={{ _: 0, [bp]: -1 }}
              display="flex"
              flexDirection={{ _: 'row', [bp]: 'column' }}
            >
              {selectedContact.cardFrontImageUrl && (
                <Box px={{ _: 1, [bp]: 0 }} py={{ _: 0, [bp]: 1 }}>
                  <Image width="100%" src={selectedContact.cardFrontImageUrl} />
                </Box>
              )}
              {selectedContact.cardBackImageUrl && (
                <Box px={{ _: 1, [bp]: 0 }} py={{ _: 0, [bp]: 1 }}>
                  <Image width="100%" src={selectedContact.cardBackImageUrl} />
                </Box>
              )}
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
