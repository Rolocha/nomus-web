import { css } from '@emotion/core'
import deepEqual from 'deep-equal'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { UpdateProfileQuery } from 'src/apollo/types/UpdateProfileQuery'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Modal from 'src/components/Modal'
import * as Text from 'src/components/Text'
import EditButton from './EditButton'
import UPDATE_PROFILE_MUTATION from './updateProfileMutation'

interface NameplateFormData {
  phoneNumber: string
  email: string
  bio: string
}

interface Props {
  defaultValues: Partial<NameplateFormData>
  editIconOnlyBp?: string | null
}

export default ({ defaultValues, editIconOnlyBp }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { register, handleSubmit, getValues, reset } = useForm<
    NameplateFormData
  >({
    defaultValues,
  })
  const [updateProfile] = useMutation<UpdateProfileQuery>(
    UPDATE_PROFILE_MUTATION,
  )

  const onFormSubmit = React.useCallback(
    async (formData: NameplateFormData) => {
      const { errors } = await updateProfile({
        variables: {
          updatedUser: formData,
        },
      })
      if (errors == null) {
        setIsEditing(false)
        // Reset form so pre-filled values are updated on next modal opening
        reset(getValues())
      }
    },
    [updateProfile, setIsEditing, reset, getValues],
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
          <Text.PageHeader mb={3}>
            Edit contact information and bio
          </Text.PageHeader>
          <Text.Body mb={4}>
            Editing your contact information and bio will change the contact
            information and short biography your profile visitors see on your
            public profile page. Keep in mind that if you change this, it may
            create a mismatch between your physical card and your digital
            identity.
          </Text.Body>
          <Form.Form onSubmit={handleSubmit(onFormSubmit)}>
            <Box
              display="flex"
              flexDirection={{ _: 'column', md: 'row' }}
              justifyContent="space-between"
              mb={3}
              mx={{ _: 0, md: -1 }}
              css={css`
                & > * {
                  flex-basis: calc(100% / 2);
                }
              `}
            >
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="phoneNumber">PHONE NUMBER</Form.Label>
                <Form.Input
                  name="phoneNumber"
                  ref={register({ required: false })}
                  type="text"
                  autoComplete="tel"
                />
              </Form.Item>
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="email">EMAIL</Form.Label>
                <Form.Input
                  name="email"
                  ref={register({ required: true })}
                  type="email"
                  autoComplete="email"
                />
              </Form.Item>
            </Box>
            <Form.Item>
              <Form.Label htmlFor="bio">BIO</Form.Label>
              <Form.TextArea
                name="bio"
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