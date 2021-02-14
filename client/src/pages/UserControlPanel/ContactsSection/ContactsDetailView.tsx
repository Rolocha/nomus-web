import * as React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import EditButton from 'src/components/EditButton'
import NotesEditingModal, {
  getNotesFormDataFromContact,
} from 'src/components/NotesEditingModal'
import ProfilePicture from 'src/components/ProfilePicture'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { getFormattedFullDate } from 'shared/utils/date'
import { formatName } from 'src/utils/name'
import ContactCardsList from './ContactCardsList'
import ContactsEmptyState from './ContactsEmptyState'
import { Link } from 'src/components/Link'
import { ContactsSortOption } from './utils'

interface Props {
  selectedContactSortOption: ContactsSortOption
  selectedContact?: Contact | null
  contacts: Contact[]
}

const bp = 'md'

const ContactsDetailView = ({
  selectedContactSortOption,
  selectedContact,
  contacts,
}: Props) => {
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false)

  const openNotesModal = React.useCallback(() => {
    setIsNotesModalOpen(true)
  }, [setIsNotesModalOpen])

  const closeNotesModal = React.useCallback(() => {
    setIsNotesModalOpen(false)
  }, [setIsNotesModalOpen])

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
          _: selectedContact ? 'none' : 'block',
          [bp]: 'block',
        }}
        gridArea="list"
        placeSelf="stretch"
        maxHeight="inherit"
        // Required to allow selected contact caret (>) to be visible
        overflow="visible"
      >
        {contacts.length === 0 ? (
          <Box py="70px">
            <ContactsEmptyState />
          </Box>
        ) : (
          <ContactCardsList
            contacts={contacts}
            selectedContactSortOption={selectedContactSortOption}
            selectedContact={selectedContact}
            viewMode="linear"
          />
        )}
      </Box>
      {selectedContact && (
        <Box
          gridArea="selectedContact"
          p={{ _: 1, [bp]: 3 }}
          display="grid"
          gridTemplateColumns={{
            _: '4fr 8fr',
            [bp]: '11em 6fr',
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
          <Box gridArea="profilePic" width="100%" placeSelf="center">
            <ProfilePicture
              name={selectedContact.name}
              profilePicUrl={selectedContact.profilePicUrl}
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
                <Text.Body2>
                  <Link to={`tel:${selectedContact.phoneNumber}`}>
                    {selectedContact.phoneNumber}
                  </Link>
                </Text.Body2>
              </Box>
            )}
            {selectedContact.email && (
              <Box px={3}>
                <Text.Label>Email</Text.Label>
                <Text.Body2>
                  <Link to={`tel:${selectedContact.email}`}>
                    {selectedContact.email}
                  </Link>
                </Text.Body2>
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
            gridTemplateColumns="11em 1fr"
            gridColumnGap={3}
            gridRowGap="24px"
            gridTemplateAreas={`
            "title editButton"
            "meetingDate meetingPlace"
            "tags additionalNotes"
          `}
          >
            <Box gridArea="title">
              <Text.SectionHeader>Your notes</Text.SectionHeader>
            </Box>

            <Box gridArea="editButton">
              <EditButton iconOnlyBp={bp} onClick={openNotesModal} />
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
              {selectedContact.tags && selectedContact.tags.length > 0 ? (
                <Box display="flex" flexWrap="wrap" data-testid="tags">
                  {selectedContact.tags.map((tag) => (
                    <Box
                      borderRadius="1em"
                      px={3}
                      py={0}
                      mr={1}
                      mb={1}
                      bg={colors.nomusBlue}
                    >
                      <Text.Body2 color="white">{tag.trim()}</Text.Body2>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Text.Body2>No tags</Text.Body2>
              )}
            </Box>

            <Box gridArea="additionalNotes">
              <Text.Label>Additional Notes</Text.Label>
              <Text.Body2>{selectedContact.notes ?? ''}</Text.Body2>
            </Box>
          </Box>

          <Box position="relative" zIndex={2}>
            <NotesEditingModal
              contact={selectedContact}
              isModalOpen={isNotesModalOpen}
              onCancel={closeNotesModal}
              onSave={closeNotesModal}
              defaultValues={getNotesFormDataFromContact(selectedContact)}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ContactsDetailView
