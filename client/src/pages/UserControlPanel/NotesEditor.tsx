import React from "react"
import { useForm } from "react-hook-form"
import Box from "src/components/Box"
import EditButton from "src/components/EditButton"

interface NotesFormData {
  meetingDate?: string
  meetingPlace?: string
  tags?: string
  notes?: string
}

interface Props {
  defaultValues: Partial<NotesFormData>
  editIconOnlyBp?: string | null
}

export default ({ defaultValues, editIconOnlyBp }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { register, handleSubmit, getValues, reset } = useForm<
    NotesFormData
  >({
    defaultValues,
  })
  
  return (
    <Box>
      <EditButton
        iconOnlyBp={editIconOnlyBp}
        onClick={() => setIsEditing(true)}
      />
    </Box>
  )
}