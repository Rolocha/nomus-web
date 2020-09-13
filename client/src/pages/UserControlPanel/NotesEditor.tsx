import React from "react"
import { useForm } from "react-hook-form"
import Box from "src/components/Box"
import EditButton from "src/components/EditButton"
import UPDATE_NOTES_MUTATION from './updateNotesMutation'
import { UpdateNotesQuery } from "src/apollo/types/UpdateNotesQuery"
import { useMutation } from "src/apollo"
import deepEqual from "deep-equal"
import { Contact } from "src/types/contact"
import Modal from "src/components/Modal"


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
  const { register, handleSubmit, getValues, reset } = useForm<
    NotesFormData
  >({
    defaultValues,
  })
  const [updateNotes] = useMutation<UpdateNotesQuery>(
    UPDATE_NOTES_MUTATION
  )

  const onFormSubmit = React.useCallback(
    async (formData: NotesFormData) => {
      const { errors } = await updateNotes({
        variables: {
          contactId: contact.id,
          notesInput: formData,
        }
      })
      if (errors == null) {
        setIsEditing(false)
        // Reset form so pre-filled values are updated on next modal opening
        reset(getValues())
      }
    },
    [updateNotes, setIsEditing, reset, getValues, contact.id]
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

        </Box>
      </Modal>
    </Box>
  )
}