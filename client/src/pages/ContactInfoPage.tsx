import { css } from '@emotion/core'
import * as React from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'src/apollo'
import {
  ContactPageQuery,
  ContactPageQueryVariables,
} from 'src/apollo/types/ContactPageQuery'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import Button from 'src/components/Button'
import EditButton from 'src/components/EditButton'
import Link, { ExternalLink } from 'src/components/Link'
import Navbar from 'src/components/Navbar'
import NotesEditingModal, {
  getNotesFormDataFromContact,
  NotesFormData,
} from 'src/components/NotesEditingModal'
import ProfilePicture from 'src/components/ProfilePicture'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import publicContactQuery from 'src/queries/publicContact'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
import { useAuth } from 'src/utils/auth'
import {
  getCurrentDateForDateInput,
  getFormattedFullDateFromDateInputString,
} from 'src/utils/date'
import { formatName } from 'src/utils/name'
import FourOhFourPage from './FourOhFourPage'

interface UrlParams {
  username?: string
}

const bp = 'md'

const ContactInfoPage = () => {
  const { username }: UrlParams = useParams()

  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false)
  const { loggedIn } = useAuth()
  const history = useHistory()
  const meetingDateRef = React.useRef<HTMLInputElement | null>(null)
  const meetingPlaceRef = React.useRef<HTMLInputElement | null>(null)
  const tagsRef = React.useRef<HTMLInputElement | null>(null)
  const notesRef = React.useRef<HTMLTextAreaElement | null>(null)

  const openNotesModal = React.useCallback(() => {
    setIsNotesModalOpen(true)
  }, [setIsNotesModalOpen])

  const closeNotesModal = React.useCallback(() => {
    setIsNotesModalOpen(false)
  }, [setIsNotesModalOpen])

  const openModalAndFocusOn = React.useCallback(
    (refObject: React.MutableRefObject<any>) => () => {
      openNotesModal()
      // Slightly hacky: We can't focus on the ref in the modal right away since the modal needs
      // time to open, so wait 100ms before calling focus. It seems to work but we can raise this
      // number if needed
      setTimeout(() => {
        refObject.current?.focus()
      }, 100)
    },
    [openNotesModal],
  )

  const { loading, data, error } = useQuery<
    ContactPageQuery,
    ContactPageQueryVariables
  >(publicContactQuery, {
    variables: {
      username: username ?? '',
    },
  })

  const publicContact = data?.publicContact

  const contactInfoParams = React.useMemo(() => {
    const params = new URLSearchParams()
    params.set(
      'meetingDate',
      publicContact?.meetingDate ?? getCurrentDateForDateInput(),
    )

    if (publicContact?.meetingPlace)
      params.set('meetingPlace', publicContact?.meetingPlace)
    if (publicContact?.notes) params.set('notes', publicContact?.notes)
    if (publicContact?.tags) params.set('tags', publicContact?.tags.join(','))

    return params
  }, [publicContact])

  const downloadLink = React.useMemo(
    () => `/api/contact-card/${username}?${contactInfoParams.toString()}`,
    [contactInfoParams, username],
  )

  const createSaveToNomusLink = React.useCallback(
    (data: NotesFormData) => {
      const params = new URLSearchParams(
        (data as unknown) as Record<string, string>,
      )
      if (username) params.set('username', username)
      const saveUrl = `/dashboard/contacts/save?${params.toString()}`
      return loggedIn
        ? saveUrl
        : `/register?redirect_url=${encodeURIComponent(saveUrl)}`
    },
    [loggedIn, username],
  )

  // If there's no username in the route, this is an invalid route, redirect to the landing page
  if (username == null) {
    return <Redirect to="/" />
  }

  if (loading || data == null) {
    return <LoadingPage fullscreen />
  }

  if (error) {
    return <Redirect to="/" />
  }
  if (data.publicContact == null) {
    return <FourOhFourPage />
  }

  // Data is loaded at this point
  const { publicContact: contact } = data

  return contact ? (
    <Box>
      <Navbar />
      <Box
        container
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="flex-start"
        minHeight="100vh"
        bg="white"
        position="relative"
      >
        <Box
          py={{ _: 0, md: '48px' }}
          display="grid"
          gridTemplateColumns={{ _: '1fr', [bp]: '7fr 5fr' }}
          gridTemplateAreas={{
            _: `
              "buttons"
              "info"
              "notes"
            `,
            [bp]: `
              "info notes"
              "buttons notes"
            `,
          }}
          mb={{ _: '100px', [bp]: 0 }}
          gridColumnGap={3}
          gridRowGap={4}
        >
          <Box
            display="grid"
            gridArea="info"
            gridTemplateColumns={{
              _: '4fr 8fr',
              [bp]: '2fr 5fr',
            }}
            gridTemplateRows={{
              _: '',
              [bp]: 'auto 1fr',
            }}
            gridTemplateAreas={{
              _: `
              "profilePic nameplate"
              "cards cards"
              "profileInfo profileInfo"
            `,
              [bp]: `
              "banner banner"
              "profilePic nameplate"
              "cards profileInfo"
          `,
            }}
            gridColumnGap={3}
            gridRowGap={3}
          >
            <Box gridArea="profilePic" placeSelf="center" width="100%">
              <ProfilePicture
                name={contact.name}
                profilePicUrl={contact.profilePicUrl}
              />
            </Box>

            <Box gridArea="nameplate" alignSelf={{ _: 'center', md: 'center' }}>
              {contact.name && (
                <Text.PageHeader mb={1} mt={0}>
                  {formatName(contact.name)}
                </Text.PageHeader>
              )}
              <Text.Body2>{contact.headline}</Text.Body2>
            </Box>

            {contact.cardFrontImageUrl && contact.cardBackImageUrl && (
              <Box
                gridArea="cards"
                display="flex"
                flexDirection={{ _: 'row', [bp]: 'column' }}
                alignItems={{ _: 'center', [bp]: 'flex-end' }}
                flexShrink={0}
              >
                {/* Front of business card */}
                {(contact.cardFrontImageUrl || contact.cardBackImageUrl) && (
                  <Box
                    width={{ _: '50%', [bp]: '100%' }}
                    mb={{ _: 0, [bp]: 2 }}
                    mr={{ _: 2, [bp]: 0 }}
                  >
                    <BusinessCardImage
                      width="100%"
                      frontImageUrl={contact.cardFrontImageUrl}
                      backImageUrl={contact.cardBackImageUrl}
                      nameForImageAlt={formatName(contact.name)}
                    />
                  </Box>
                )}
              </Box>
            )}

            <Box gridArea="profileInfo">
              <Box mb={3}>
                <Text.Label mb={1}>PHONE</Text.Label>
                <Text.Body2>{contact.phoneNumber}</Text.Body2>
              </Box>

              <Box mb={3}>
                <Text.Label>EMAIL</Text.Label>
                <Text.Body2>{contact.email}</Text.Body2>
              </Box>

              <Box>
                <Text.Label>BIO</Text.Label>
                <Text.Body2>{contact.bio}</Text.Body2>
              </Box>
            </Box>
          </Box>

          <Box
            gridArea="notes"
            placeSelf="stretch"
            display="grid"
            gridTemplateColumns="2fr 1fr"
            gridColumnGap={3}
            gridRowGap="24px"
            borderRadius={3}
            ml={{ _: 0, [bp]: 4 }}
            borderTop={`16px solid ${colors.gold}`}
            alignContent="flex-start"
            bg={colors.ivory}
            padding={{ _: '24px', [bp]: '50px' }}
            gridTemplateAreas={`
            "title editButton"
            "meetingDate meetingDate"
            "meetingPlace meetingPlace"
            "tags tags"
            "notes notes"
          `}
          >
            <Box gridArea="title" placeSelf="center start">
              <Text.SectionHeader>Your notes</Text.SectionHeader>
            </Box>

            <Box gridArea="editButton">
              <EditButton onClick={openModalAndFocusOn(meetingDateRef)} />
            </Box>

            <Box gridArea="meetingDate">
              <Text.Label>Meeting Date</Text.Label>
              <Text.Body2 data-testid="meetingDate">
                {getFormattedFullDateFromDateInputString(
                  contact.meetingDate ?? getCurrentDateForDateInput(),
                )}
              </Text.Body2>
            </Box>

            <Box gridArea="meetingPlace">
              <Text.Label>Meeting Place</Text.Label>
              {contact.meetingPlace ? (
                <Text.Body2 data-testid="meetingPlace">
                  {contact.meetingPlace}
                </Text.Body2>
              ) : (
                <Button
                  variant="tertiary"
                  onClick={openModalAndFocusOn(meetingPlaceRef)}
                >
                  <Text.Plain
                    textAlign="left"
                    fontWeight="normal"
                    fontStyle="italic"
                    color={colors.nomusBlue}
                  >
                    Make note of where you met {formatName(contact.name)}
                  </Text.Plain>
                </Button>
              )}
            </Box>

            <Box gridArea="tags">
              <Text.Label>Tags</Text.Label>
              {contact.tags && contact.tags.length > 0 ? (
                <Box display="flex" flexWrap="wrap" data-testid="tags">
                  {contact.tags.map((tag) => (
                    <Box
                      key={tag}
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
                <Button
                  variant="tertiary"
                  onClick={openModalAndFocusOn(tagsRef)}
                >
                  <Text.Plain
                    textAlign="left"
                    fontWeight="normal"
                    fontStyle="italic"
                    color={colors.nomusBlue}
                  >
                    Add tags to make organizing and searching easier
                  </Text.Plain>
                </Button>
              )}
            </Box>

            <Box gridArea="notes">
              <Text.Label>Additional Notes</Text.Label>
              {contact.notes ? (
                <Text.Body2
                  css={css({ whiteSpace: 'pre-wrap' })}
                  data-testid="notes"
                >
                  {contact.notes}
                </Text.Body2>
              ) : (
                <Button
                  variant="tertiary"
                  onClick={openModalAndFocusOn(notesRef)}
                >
                  <Text.Plain
                    textAlign="left"
                    fontWeight="normal"
                    fontStyle="italic"
                    color={colors.nomusBlue}
                  >
                    Add your own notes to this contact. Do they have cool
                    glasses? Like the same sports team?
                  </Text.Plain>
                </Button>
              )}
            </Box>
          </Box>

          <NotesEditingModal
            contact={contact}
            isModalOpen={isNotesModalOpen}
            onCancel={() => {
              closeNotesModal()
            }}
            onSave={(data) => {
              if (!loggedIn) {
                history.push(createSaveToNomusLink(data))
              }
              closeNotesModal()
            }}
            defaultValues={getNotesFormDataFromContact(contact)}
            fieldRefs={{
              meetingDate: meetingDateRef,
              meetingPlace: meetingPlaceRef,
              tags: tagsRef,
              notes: notesRef,
            }}
          />

          <Box
            // Only upper margin in desktop mode
            gridArea="buttons"
            display="grid"
            css={css`
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              padding: 16px;
              ${mq[bp]} {
                padding: 0;
                position: static;
              }
            `}
            bg="white"
            boxShadow={{ _: 'workingWindow', [bp]: 'unset' }}
            gridTemplateColumns={{ _: '1fr 1fr', [bp]: '3fr 3fr 1fr' }}
            gridColumnGap={{ _: 2, [bp]: 3 }}
            gridRowGap={2}
          >
            <ExternalLink
              asButton
              buttonStyle="primary"
              buttonSize="big"
              download={`${contact.username}.vcf`}
              href={downloadLink}
            >
              Save contact card
            </ExternalLink>

            {contact.connected ? (
              <Button variant="secondary" size="big" disabled>
                <Box
                  display="flex"
                  alignItems="center"
                  width="100%"
                  justifyContent="center"
                >
                  <SVG.Check /> <span>Saved to Nomus</span>
                </Box>
              </Button>
            ) : (
              <Link
                to={createSaveToNomusLink(getNotesFormDataFromContact(contact))}
                asButton
                buttonStyle="secondary"
                buttonSize="big"
              >
                Save to Nomus
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null
}

export default ContactInfoPage
