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
import EditButton from '../../components/EditButton'
import UPDATE_PROFILE_MUTATION from './updateProfileMutation'

interface NameplateFormData {
  firstName: string
  middleName?: string
  lastName: string
  headline: string
}

interface Props {
  defaultValues: Partial<NameplateFormData>
  editIconOnlyBp?: string | null
}

export default ({ defaultValues, editIconOnlyBp }: Props) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
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
      setIsSubmitting(true)
      try {
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
      } finally {
        setIsSubmitting(false)
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
            inProgress: isSubmitting,
            inProgressText: 'Saving',
          },
          secondary: {
            text: 'Cancel',
            handler: () => setIsEditing(false),
          },
        }}
      >
        <Box>
          <Text.CardHeader mb={3}>Edit name and headline</Text.CardHeader>
          <Text.Body2 mb={4}>
            Editing your name will change the name your profile visitors see on
            your public profile page. Keep in mind that if you change this, it
            may create a mismatch between your physical card and your digital
            identity.
          </Text.Body2>
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
                <Form.Label htmlFor="firstName">FIRST NAME</Form.Label>
                <Form.Input
                  name="firstName"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="given-name"
                />
              </Form.Item>
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="middleName">MIDDLE NAME</Form.Label>
                <Form.Input
                  name="middleName"
                  ref={register({ required: false })}
                  type="text"
                  autoComplete="additional-name"
                />
              </Form.Item>
              <Form.Item px={{ _: 0, md: 1 }} mb={{ _: 3, md: 0 }}>
                <Form.Label htmlFor="lastName">LAST NAME</Form.Label>
                <Form.Input
                  name="lastName"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="family-name"
                />
              </Form.Item>
            </Box>
            <Form.Item>
              <Form.Label>HEADLINE</Form.Label>
              <Form.Input
                name="headline"
                ref={register({ required: true })}
                type="text"
              />
            </Form.Item>
          </Form.Form>
        </Box>
      </Modal>
    </Box>
  )
}
