import * as React from 'react'
import { formatPhoneNumber } from 'react-phone-number-input'
import Box from 'src/components/Box'
import BusinessCardFan from 'src/components/BusinessCardFan'
import Button from 'src/components/Button'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import NotesEditingModal, {
  getNotesFormDataFromContact,
} from 'src/components/NotesEditingModal'
import ProfilePicture from 'src/components/ProfilePicture'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { getFormattedFullDateFromDateInputString } from 'src/utils/date'
import { formatName } from 'src/utils/name'
import ContactCardsList from './ContactCardsList'
import ContactsEmptyState from './ContactsEmptyState'
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
      display={{ base: undefined, [bp]: 'grid' }}
      maxHeight={{ base: undefined, [bp]: '500px' }}
      gridTemplateAreas={{
        base: undefined,
        [bp]: `
      "list selectedContact"
      `,
      }}
      gridTemplateColumns="4fr 8fr"
      gridColumnGap={3}
    >
      <Box
        display={{
          base: selectedContact ? 'none' : 'block',
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
          p={{ base: 1, [bp]: 3 }}
          display="grid"
          gridTemplateColumns={{
            base: '4fr 8fr',
            [bp]: '11em 6fr',
          }}
          gridTemplateAreas={{
            base: `
            "profilePic nameplate"
            "cards cards"
            "contactInfo contactInfo"
            "website website"
            "bio bio"
            "notes notes"
          `,
            [bp]: `
              "profilePic nameplate"
              "profilePic contactInfo"
              "cards website"
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

          <Box gridArea="nameplate" alignSelf={{ base: 'start', md: 'center' }}>
            <Text.SectionSubheader mb={1} mt={0}>
              {formatName(selectedContact.name)}
            </Text.SectionSubheader>
            <Text.Body2>{selectedContact.headline}</Text.Body2>
          </Box>

          <Box
            gridArea="contactInfo"
            display="grid"
            gridColumnGap={3}
            gridRowGap={3}
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gridTemplateAreas={`
            "position company"
            "phone email"
          `}
          >
            <Box gridArea="position">
              <Text.Label>Position</Text.Label>
              <Text.Body2>{selectedContact.position}</Text.Body2>
            </Box>

            <Box gridArea="company">
              <Text.Label>Company</Text.Label>
              <Text.Body2>{selectedContact.company}</Text.Body2>
            </Box>

            <Box gridArea="phone">
              <Text.Label>Phone</Text.Label>
              {selectedContact.phoneNumber && (
                <Text.Body2>
                  <Link to={`tel:${selectedContact.phoneNumber}`}>
                    {formatPhoneNumber(selectedContact.phoneNumber)}
                  </Link>
                </Text.Body2>
              )}
            </Box>

            <Box gridArea="email">
              <Text.Label>Email</Text.Label>
              <Text.Body2>
                <Link to={`tel:${selectedContact.email}`}>
                  {selectedContact.email}
                </Link>
              </Text.Body2>
            </Box>
          </Box>

          {selectedContact.cardFrontImageUrl &&
            selectedContact.cardBackImageUrl && (
              <Box
                gridArea="cards"
                width={{ base: '100%', [bp]: '100%' }}
                px={2}
              >
                <BusinessCardFan
                  frontImageUrl={selectedContact.cardFrontImageUrl}
                  backImageUrl={selectedContact.cardBackImageUrl}
                />
              </Box>
            )}

          {selectedContact.website && (
            <Box mb={3} gridArea="website">
              <Text.Label>WEBSITE</Text.Label>
              <Text.Body2>
                <Link to={selectedContact.website}>
                  {selectedContact.website}
                </Link>
              </Text.Body2>
            </Box>
          )}

          {selectedContact.bio && (
            <Box gridArea="bio">
              <Text.Label>BIO</Text.Label>
              <Text.Body3>{selectedContact.bio}</Text.Body3>
            </Box>
          )}

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
              <Button
                variant="tertiary"
                leftIcon={<Icon of="pen" />}
                onClick={openNotesModal}
              >
                <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
                  Edit
                </Box>
              </Button>
            </Box>

            <Box gridArea="meetingDate">
              <Text.Label>Meeting Date</Text.Label>
              <Text.Body2>
                {selectedContact.meetingDate
                  ? getFormattedFullDateFromDateInputString(
                      selectedContact.meetingDate,
                    )
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
