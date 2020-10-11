import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'src/apollo'
import {
  ContactPageQuery,
  ContactPageQueryVariables,
} from 'src/apollo/types/ContactPageQuery'
import { UpdateContactInfoMutation } from 'src/apollo/types/UpdateContactInfoMutation'
import Banner from 'src/components/Banner'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import Button from 'src/components/Button'
import EditButton from 'src/components/EditButton'
import * as Form from 'src/components/Form'
import Image from 'src/components/Image'
import Link from 'src/components/Link'
import Modal from 'src/components/Modal'
import Navbar from 'src/components/Navbar'
import * as Text from 'src/components/Text'
import updateContactInfoMutation from 'src/mutations/updateContactInfoMutation'
import LoadingPage from 'src/pages/LoadingPage'
import publicContactQuery from 'src/queries/publicContact'
import { colors } from 'src/styles'
import { mq } from 'src/styles/breakpoints'
import { useAuth } from 'src/utils/auth'
import {
  getFormattedDateFromISODateString,
  getInputCompliantDate,
} from 'src/utils/date'
import { formatName } from 'src/utils/name'

interface UrlParams {
  username?: string
}

const bp = 'md'

interface NotesFormData {
  meetingDate: string | null
  meetingPlace: string | null
  // Enforcing comma-separated tag values
  tags: string | null
  notes: string | null
}

const ContactInfoPage = () => {
  const { username }: UrlParams = useParams()
  const history = useHistory()
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false)
  const [hasMadeEdits, setHasMadeEdits] = React.useState(false)
  const [hasInstantiatedNotes, setHasInstantiatedNotes] = React.useState(false)

  const { loggedIn, id: ownUserId } = useAuth()

  const meetingDateRef = React.useRef<HTMLInputElement | null>(null)
  const meetingPlaceRef = React.useRef<HTMLInputElement | null>(null)
  const tagsRef = React.useRef<HTMLInputElement | null>(null)
  const notesRef = React.useRef<HTMLTextAreaElement | null>(null)

  const { handleSubmit, register, watch, reset } = useForm<NotesFormData>({
    defaultValues: {
      meetingDate: getInputCompliantDate(Date.now()),
    },
  })

  const formFields = watch()

  const openNotesModal = React.useCallback(() => {
    setIsNotesModalOpen(true)
  }, [setIsNotesModalOpen])

  const closeNotesModal = React.useCallback(() => setIsNotesModalOpen(false), [
    setIsNotesModalOpen,
  ])

  const setRefAndRegister = React.useCallback(
    (refObject: React.MutableRefObject<any>) => (element: any) => {
      refObject.current = element
      register(element)
    },
    [register],
  )

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, data, error } = useQuery<
    ContactPageQuery,
    ContactPageQueryVariables
  >(publicContactQuery, {
    variables: {
      username: username ?? '',
    },
  })

  const [updateContactInfo] = useMutation<UpdateContactInfoMutation>(
    updateContactInfoMutation,
  )

  const contactInfoParams = React.useMemo(() => {
    const params = new URLSearchParams()
    if (formFields.meetingDate)
      params.set('meetingDate', formFields.meetingDate)
    if (formFields.meetingPlace)
      params.set('meetingPlace', formFields.meetingPlace)
    if (formFields.notes) params.set('notes', formFields.notes)
    if (formFields.tags) params.set('tags', formFields.tags)

    return params
  }, [
    formFields.meetingDate,
    formFields.meetingPlace,
    formFields.notes,
    formFields.tags,
  ])

  const downloadLink = React.useMemo(
    () => `/api/contact-card/${username}?${contactInfoParams.toString()}`,
    [contactInfoParams, username],
  )

  const saveToNomusLink = React.useMemo(() => {
    const params = new URLSearchParams(contactInfoParams)
    if (username) params.set('username', username)
    const saveUrl = `/dashboard/contacts/save?${params.toString()}`
    return loggedIn
      ? saveUrl
      : `/register?redirect_url=${encodeURIComponent(saveUrl)}`
  }, [loggedIn, contactInfoParams, username])

  // If there's no username in the route, this is an invalid route, redirect to the landing page
  if (username == null) {
    history.push('/')
    return null
  }

  if (loading || data == null) {
    return <LoadingPage />
  }

  if ((!loading && data == null) || error) {
    history.push('/')
    return null
  }

  // Data is loaded at this point
  const { publicContact: contact } = data

  // If we haven't done so yet, update the form state with the contact info
  // we just received from the server
  if (!hasInstantiatedNotes) {
    reset({
      meetingDate: contact.meetingDate
        ? getInputCompliantDate(contact.meetingDate)
        : formFields.meetingDate,
      meetingPlace: contact.meetingPlace ?? formFields.meetingPlace,
      notes: contact.notes ?? formFields.notes,
      tags: contact.tags ? contact.tags.join(', ') : formFields.tags,
    })
    setHasInstantiatedNotes(true)
  }

  const saveNotes = async (data: NotesFormData) => {
    setHasMadeEdits(true)
    // Update form's default values so if they open the modal again,
    // it keeps the previous edits
    reset(watch())
    if (loggedIn) {
      await updateContactInfo({
        variables: {
          contactId: contact.id,
          contactInfo: {
            meetingDate: data.meetingDate,
            meetingPlace: data.meetingPlace,
            notes: data.notes,
            tags: (() => {
              const tags = data?.tags
              return tags ? tags.split(',').map((s) => s.trim()) : []
            })(),
          },
        },
      })
    } else {
    }
    closeNotesModal()
  }

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
              "buttons buttons"
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
              "banner banner"
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
            {hasMadeEdits && !loggedIn && (
              <Box gridArea="banner">
                <Banner
                  type="warning"
                  title="Unsaved notes"
                  description="Save to Nomus to avoid losing your notes."
                />
              </Box>
            )}
            <Box gridArea="profilePic">
              <Image
                borderRadius="50%"
                width="100%"
                height="100%"
                src={
                  contact.profilePicUrl ?? 'http://via.placeholder.com/500x500'
                }
              />
            </Box>

            <Box gridArea="nameplate" alignSelf={{ _: 'center', md: 'center' }}>
              {contact.name && (
                <Text.SectionHeader mb={1} mt={0}>
                  {formatName(contact.name)}
                </Text.SectionHeader>
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
                {contact.cardFrontImageUrl && (
                  <Box
                    width={{ _: '50%', [bp]: '100%' }}
                    mb={{ _: 0, [bp]: 2 }}
                    mr={{ _: 2, [bp]: 0 }}
                  >
                    <BusinessCardImage
                      width="100%"
                      frontImageUrl={contact.cardFrontImageUrl}
                    />
                  </Box>
                )}
                {contact.cardBackImageUrl && (
                  <Box width={{ _: '50%', [bp]: '100%' }}>
                    {/* Back of business card */}
                    <BusinessCardImage
                      width="100%"
                      backImageUrl={contact.cardBackImageUrl}
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
            placeSelf="start stretch"
            display="grid"
            gridTemplateColumns="2fr 1fr"
            gridColumnGap={3}
            gridRowGap={2}
            borderRadius={3}
            borderTop={`16px solid ${colors.gold}`}
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
              {formFields.meetingDate ? (
                <Text.Body2>
                  {getFormattedDateFromISODateString(formFields.meetingDate)}
                </Text.Body2>
              ) : (
                <Text.Body2>ERROR</Text.Body2>
              )}
            </Box>

            <Box gridArea="meetingPlace">
              <Text.Label>Meeting Place</Text.Label>
              {formFields.meetingPlace ? (
                <Text.Body2>{formFields.meetingPlace}</Text.Body2>
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
              {formFields.hasOwnProperty('tags') &&
              formFields.tags &&
              formFields.tags.length > 0 ? (
                <Box display="flex" flexWrap="wrap">
                  {formFields.tags.split(',').map((tag) => (
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
              {formFields.notes ? (
                <Text.Body2>{formFields.notes}</Text.Body2>
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

          <Modal
            isOpen={isNotesModalOpen}
            onClose={closeNotesModal}
            onClickOutside={closeNotesModal}
            actions={{
              primary: {
                text: 'Save',
                submitForm: 'notes-form',
              },
              secondary: {
                text: 'Cancel',
                handler: closeNotesModal,
              },
            }}
            width="min(700px, 95%)"
          >
            <Text.CardHeader mb={3}>
              Edit your notes about {formatName(contact.name)}
            </Text.CardHeader>
            <Text.Body2 mb={4}>
              Jotting down a couple of quick details about your connection will
              help you better remember them and why they matter to you.
            </Text.Body2>
            <Form.Form onSubmit={handleSubmit(saveNotes)} id="notes-form">
              <Box
                display="grid"
                gridTemplateColumns={{ _: '1fr', [bp]: '1fr 1fr 1fr' }}
                gridTemplateAreas={{
                  _: `
                  "meetingDate"
                  "meetingPlace"
                  "tags"
                  "notes"
                  `,
                  [bp]: `

                  "meetingDate meetingPlace tags"
                  "notes notes notes"
                `,
                }}
                gridColumnGap={3}
                gridRowGap={3}
                css={css({
                  placeItems: 'center stretch',
                })}
              >
                <Box gridArea="meetingDate">
                  <Form.Label>Meeting Date</Form.Label>
                  <Form.Input
                    width="100%"
                    type="date"
                    name="meetingDate"
                    placeholder="YYYY-MM-DD"
                    defaultValue={formFields.meetingDate ?? ''}
                    ref={setRefAndRegister(meetingDateRef)}
                  ></Form.Input>
                </Box>

                <Box gridArea="meetingPlace">
                  <Form.Label>Meeting Place</Form.Label>
                  <Form.Input
                    width="100%"
                    type="text"
                    name="meetingPlace"
                    defaultValue={formFields.meetingPlace ?? ''}
                    ref={setRefAndRegister(meetingPlaceRef)}
                  ></Form.Input>
                </Box>

                <Box gridArea="tags">
                  <Form.Label>
                    Tags{' '}
                    <Text.Body3
                      css={css({
                        textTransform: 'none',
                      })}
                      as="span"
                      color={colors.midnightGray}
                    >
                      (comma-separated)
                    </Text.Body3>
                  </Form.Label>
                  <Form.Input
                    width="100%"
                    type="text"
                    name="tags"
                    defaultValue={formFields.tags ?? ''}
                    ref={setRefAndRegister(tagsRef)}
                  ></Form.Input>
                </Box>

                <Box gridArea="notes">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.TextArea
                    name="notes"
                    width="100%"
                    rows={4}
                    ref={setRefAndRegister(notesRef)}
                  />
                </Box>
              </Box>
            </Form.Form>
          </Modal>

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
            gridTemplateColumns={{ _: '1fr 1fr', [bp]: '3fr 3fr 6fr' }}
            gridColumnGap={{ _: 2, [bp]: 3 }}
            gridRowGap={2}
          >
            <Link
              asButton
              buttonStyle="primary"
              buttonSize="big"
              download={`${contact.username}.vcf`}
              type="external"
              to={downloadLink}
            >
              <Text.Body2 color="white">Save contact card</Text.Body2>
            </Link>

            {contact.connected || contact.id === ownUserId ? (
              <Button variant="secondary" size="big" disabled>
                Saved
              </Button>
            ) : (
              <Link
                to={saveToNomusLink}
                asButton
                buttonStyle="secondary"
                buttonSize="big"
              >
                <Text.Body2 color="nomusBlue">Save to Nomus</Text.Body2>
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  ) : null
}

export default ContactInfoPage
