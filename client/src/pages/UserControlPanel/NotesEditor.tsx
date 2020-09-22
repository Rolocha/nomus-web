import React from 'react'
import { useForm } from 'react-hook-form'
import Box from 'src/components/Box'
import EditButton from 'src/components/EditButton'
import UPDATE_NOTES_MUTATION from './updateNotesMutation'
import { UpdateNotesQuery } from 'src/apollo/types/UpdateNotesQuery'
import { useMutation } from 'src/apollo'
import deepEqual from 'deep-equal'
import * as Text from 'src/components/Text'
import { Contact } from 'src/types/contact'
import Modal from 'src/components/Modal'
import * as Form from 'src/components/Form'
import { css } from '@emotion/core'

interface NotesFormData {
  meetingDate?: Date | null
  meetingPlace?: string | null
  // tags?: string | null
  notes?: string | null
}

interface Props {
  defaultValues: Partial<NotesFormData>
  contact: Contact
  editIconOnlyBp?: string | null
}

export default ({ defaultValues, contact, editIconOnlyBp }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { register, handleSubmit, getValues, reset } = useForm<NotesFormData>({
    defaultValues,
  })
  const [updateNotes] = useMutation<UpdateNotesQuery>(UPDATE_NOTES_MUTATION)

  const onFormSubmit = React.useCallback(
    async (formData: NotesFormData) => {
      if (!formData.meetingDate) {
        formData.meetingDate = null
      }
      const { errors } = await updateNotes({
        variables: {
          contactId: contact.id,
          notesInput: formData,
        },
      })
      if (errors == null) {
        setIsEditing(false)
        // Reset form so pre-filled values are updated on next modal opening
        reset(getValues())
      }
    },
    [updateNotes, setIsEditing, reset, getValues, contact.id],
  )

  const hasUnsavedChanges = React.useCallback(
    () => !deepEqual(defaultValues, getValues()),
    [defaultValues, getValues],
  )

  return (
    <Box>
      <EditButton
        iconOnlyBp={editIconOnlyBp}
        onClick={() => setIsEditing(true)}
      />
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        confirmClose={hasUnsavedChanges}
        width="calc(min(95%, 800px))"
        actions={{
          primary: {
            text: 'Save',
            handler: handleSubmit(onFormSubmit),
          },
          secondary: {
            text: 'Cancel',
            handler: () => setIsEditing(false),
          },
        }}
      >
        <Box>
          <Text.PageHeader mb={3}>Edit Notes</Text.PageHeader>
          <Form.Form onSubmit={handleSubmit(onFormSubmit)}>
            <Box
              display="flex"
              flexDirection={{ _: 'column', md: 'row' }}
              justifyContent="space-between"
              mb={3}
              mx={{ _: 0, md: -1 }}
              css={css`
                & > * {
                  flex-basis: calc(100% / 3);
                }
              `}
            >
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="meetingDate">MEETING DATE</Form.Label>
                <Form.Input
                  name="meetingDate"
                  type="date"
                  ref={register({ required: false })}
                />
              </Form.Item>
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="meetingPlace">MEETING PLACE</Form.Label>
                <Form.Input
                  name="meetingPlace"
                  ref={register({ required: false })}
                  type="text"
                />
              </Form.Item>
            </Box>
            <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
              <Form.Label htmlFor="notes">ADDITIONAL NOTES</Form.Label>
              <Form.TextArea
                name="notes"
                rows={4}
                ref={register({ required: false })}
              />
            </Form.Item>
          </Form.Form>
        </Box>
      </Modal>
    </Box>
  )
}
