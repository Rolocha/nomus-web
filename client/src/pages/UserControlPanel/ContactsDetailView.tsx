import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import * as Text from 'src/components/Text'
import { Contact } from 'src/types/contact'
import { getFormattedFullDate } from 'src/utils/date'
import { formatName } from 'src/utils/name'
import { ContactsSortOption } from './contact-sorting'
import ContactCardsList from './ContactCardsList'
import BusinessCardImage from 'src/components/BusinessCardImage'

interface ParamsType {
  usernameOrId: string
}

interface Props {
  selectedContactSortOption: ContactsSortOption
  selectedContactUsernameOrId?: string
  contacts: Contact[]
  searchQueryValue: string
}

const bp = 'md'

const ContactsDetailView = ({
  selectedContactSortOption,
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
        // Required to allow selected contact caret (>) to be visible
        overflow="visible"
      >
        <ContactCardsList
          contacts={contacts}
          selectedContactSortOption={selectedContactSortOption}
          selectedContactUsernameOrId={selectedContactUsernameOrId}
          searchQuery={searchQueryValue}
          viewMode="linear"
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
            <Text.SectionSubheader mb={1} mt={0}>
              {formatName(selectedContact.name)}
            </Text.SectionSubheader>
            <Text.Body2>{selectedContact.headline}</Text.Body2>
          </Box>
          <Box
            gridArea="contactInfo"
            alignSelf="start"
            display="flex"
            flexDirection="row"
            mx={-3}
          >
            {selectedContact.phoneNumber && (
              <Box px={3}>
                <Text.Label>Phone</Text.Label>
                <Text.Body2>{selectedContact.phoneNumber}</Text.Body2>
              </Box>
            )}
            {selectedContact.email && (
              <Box px={3}>
                <Text.Label>Email</Text.Label>
                <Text.Body2>{selectedContact.email}</Text.Body2>
              </Box>
            )}
          </Box>

          {selectedContact.cardFrontImageUrl &&
            selectedContact.cardBackImageUrl && (
              <Box
                gridArea="cards"
                width={{ _: '100%', [bp]: '100%' }}
                display="flex"
                px={2}
                flexDirection={{ _: 'row', [bp]: 'column' }}
              >
                <BusinessCardImage
                  width="100%"
                  frontImageUrl={selectedContact.cardFrontImageUrl}
                  backImageUrl={selectedContact.cardBackImageUrl}
                />
              </Box>
            )}

          <Box gridArea="bio">
            <Text.Label>BIO</Text.Label>
            <Text.Body3>{selectedContact.bio}</Text.Body3>
          </Box>

          <Box
            gridArea="notes"
            display="grid"
            gridTemplateColumns="2fr 6fr"
            gridColumnGap={3}
            gridRowGap="24px"
            gridTemplateAreas={`
            "title title"
            "meetingDate meetingPlace"
            "tags additionalNotes"
          `}
          >
            <Box gridArea="title">
              <Text.SectionHeader>Your notes</Text.SectionHeader>
            </Box>

            <Box gridArea="meetingDate">
              <Text.Label>Meeting Date</Text.Label>
              <Text.Body2>
                {selectedContact.meetingDate
                  ? getFormattedFullDate(selectedContact.meetingDate)
                  : ''}
              </Text.Body2>
            </Box>

            <Box gridArea="meetingPlace">
              <Text.Label>Meeting Place</Text.Label>
              <Text.Body2>{selectedContact.meetingPlace ?? ''}</Text.Body2>
            </Box>

            <Box gridArea="tags">
              <Text.Label>Tags</Text.Label>
              <Text.Body2>TODO</Text.Body2>
            </Box>

            <Box gridArea="additionalNotes">
              <Text.Label>Additional Notes</Text.Label>
              <Text.Body2>{selectedContact.notes ?? ''}</Text.Body2>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ContactsDetailView
