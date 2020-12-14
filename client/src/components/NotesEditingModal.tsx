import { css } from '@emotion/core'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'src/apollo'
import { SaveContactMutation } from 'src/apollo/types/SaveContactMutation'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Modal from 'src/components/Modal'
import * as Text from 'src/components/Text'
import saveContactMutation from 'src/mutations/saveContactMutation'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { useAuth } from 'src/utils/auth'
import { getCurrentDateForDateInput } from 'src/utils/date'
import { formatName } from 'src/utils/name'

interface FieldRefs {
  meetingDate?: React.RefObject<HTMLInputElement | null>
  meetingPlace?: React.RefObject<HTMLInputElement | null>
  tags?: React.RefObject<HTMLInputElement | null>
  notes?: React.RefObject<HTMLTextAreaElement | null>
}

interface Props {
  modalTitle?: string
  modalDescription?: string
  isModalOpen: boolean
  onCancel: (data: NotesFormData) => void
  onSave: (data: NotesFormData) => void
  defaultValues?: Partial<NotesFormData>
  contact: Contact
  fieldRefs?: FieldRefs
}

export interface NotesFormData {
  meetingDate: string | null
  meetingPlace: string | null
  // Enforcing comma-separated tag values
  tags: string | null
  notes: string | null
}

const bp = 'md'

const NotesEditingModal = ({
  modalTitle,
  modalDescription,
  isModalOpen,
  onCancel,
  defaultValues,
  contact,
  onSave,
  fieldRefs,
}: Props) => {
  const { handleSubmit, register, watch, reset, formState } = useForm<
    NotesFormData
  >({
    defaultValues: {
      ...defaultValues,
      meetingDate: getCurrentDateForDateInput(),
    },
  })

  const [saveContact] = useMutation<SaveContactMutation>(saveContactMutation)
  const formFields = watch()
  const { loggedIn } = useAuth()

  React.useEffect(() => {
    // While the notes modal is open and there are edits, make sure closing the page triggers a confirmation dialog
    if (isModalOpen && formState.isDirty) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = null
    }
  }, [isModalOpen, formState.isDirty])

  const setRefAndRegister = React.useCallback(
    (refObject?: React.MutableRefObject<any>) => (element: any) => {
      if (refObject) {
        refObject.current = element
        register(element)
      }
    },
    [register],
  )

  const saveNotes = async (data: NotesFormData) => {
    if (loggedIn) {
      const tags = data?.tags ? data.tags.split(',').map((s) => s.trim()) : []
      await saveContact({
        variables: {
          username: contact.username,
          contactInfo: {
            meetingDate: data.meetingDate,
            meetingPlace: data.meetingPlace,
            notes: data.notes,
            tags,
          },
        },
      })

      // Update form's default values so if they open the modal again,
      // it keeps the previous edits
      reset(watch())
    }

    onSave(data)
    window.onbeforeunload = null
  }

  return (
    <Modal
      confirmClose={() => formState.isDirty}
      isOpen={isModalOpen}
      onClose={() => {
        onCancel(formFields)
      }}
      actions={{
        primary: {
          text: 'Save',
          submitForm: 'notes-form',
        },
        secondary: {
          text: 'Cancel',
          close: true,
        },
      }}
      width="min(700px, 95%)"
    >
      <Text.CardHeader mb={3}>
        {modalTitle ?? `Edit notes about ${formatName(contact.name)}`}
      </Text.CardHeader>
      <Text.Body2 mb={4}>
        {modalDescription ??
          `Jotting down a couple of quick details about your connection will help
        you better remember them and why they matter to you.`}
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
              ref={setRefAndRegister(fieldRefs?.meetingDate)}
            ></Form.Input>
          </Box>

          <Box gridArea="meetingPlace">
            <Form.Label>Meeting Place</Form.Label>
            <Form.Input
              width="100%"
              type="text"
              name="meetingPlace"
              defaultValue={formFields.meetingPlace ?? ''}
              ref={setRefAndRegister(fieldRefs?.meetingPlace)}
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
              ref={setRefAndRegister(fieldRefs?.tags)}
            ></Form.Input>
          </Box>

          <Box gridArea="notes">
            <Form.Label>Additional Notes</Form.Label>
            <Form.TextArea
              name="notes"
              width="100%"
              rows={4}
              ref={setRefAndRegister(fieldRefs?.notes)}
            />
          </Box>
        </Box>
      </Form.Form>
    </Modal>
  )
}

export default NotesEditingModal
