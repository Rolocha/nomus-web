import { css } from '@emotion/react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
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
import { getCurrentDateForDateInput } from 'shared/utils/date'
import { useRegisterWithRef } from 'src/utils/form'
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

export const getNotesFormDataFromContact = (
  contact: Contact,
): NotesFormData => {
  return {
    meetingDate: contact.meetingDate,
    meetingPlace: contact.meetingPlace,
    tags: contact?.tags?.join(', ') ?? '',
    notes: contact?.notes,
  }
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
  const wasModalJustClosed = React.useRef(false)
  const { handleSubmit, register, watch, reset, formState } = useForm<
    NotesFormData
  >({
    mode: 'onChange',
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

  const registerWithRef = useRegisterWithRef(register)

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

  // If we haven't done so yet, update the form state with the contact info
  // we just received from the server
  React.useEffect(() => {
    if (isModalOpen && wasModalJustClosed.current) {
      reset({
        meetingDate: defaultValues?.meetingDate ?? formFields.meetingDate,
        meetingPlace: defaultValues?.meetingPlace ?? formFields.meetingPlace,
        notes: defaultValues?.notes ?? formFields.notes,
        tags: defaultValues?.tags ?? formFields.tags,
      })
      wasModalJustClosed.current = false
    }
  }, [isModalOpen, wasModalJustClosed, defaultValues, formFields, reset])
  return (
    <Modal
      confirmClose={() => formState.isDirty}
      isOpen={isModalOpen}
      onClose={() => {
        wasModalJustClosed.current = true
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
      header={{
        title: modalTitle ?? `Edit notes about ${formatName(contact.name)}`,
        subtitle:
          modalDescription ??
          `Jotting down a couple of quick details about your connection will help
      you better remember them and why they matter to you.`,
      }}
    >
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
            placeItems: 'start stretch',
          })}
        >
          <Form.Item alignItems="stretch" gridArea="meetingDate" width="100%">
            <Form.Label>Meeting Date</Form.Label>
            <Form.Input
              width="100%"
              // Needed to fix this janky iOS Safari bug with input[type="date"]: https://stackoverflow.com/questions/26573346/ios-safari-messes-up-input-type-date/44457841
              minWidth="95%"
              type="date"
              name="meetingDate"
              placeholder="YYYY-MM-DD"
              defaultValue={formFields.meetingDate ?? ''}
              ref={registerWithRef(fieldRefs?.meetingDate)}
            ></Form.Input>
          </Form.Item>

          <Form.Item gridArea="meetingPlace">
            <Form.Label>Meeting Place</Form.Label>
            <Form.Input
              width="100%"
              type="text"
              name="meetingPlace"
              defaultValue={formFields.meetingPlace ?? ''}
              ref={registerWithRef(fieldRefs?.meetingPlace)}
            ></Form.Input>
          </Form.Item>

          <Form.Item gridArea="tags">
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
              ref={registerWithRef(fieldRefs?.tags)}
            ></Form.Input>
          </Form.Item>

          <Form.Item gridArea="notes">
            <Form.Label>Additional Notes</Form.Label>
            <Form.TextArea
              name="notes"
              width="100%"
              rows={4}
              ref={registerWithRef(fieldRefs?.notes)}
            />
          </Form.Item>
        </Box>
      </Form.Form>
    </Modal>
  )
}

export default NotesEditingModal
