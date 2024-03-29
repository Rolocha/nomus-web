import { yupResolver } from '@hookform/resolvers/yup'
import deepEqual from 'deep-equal'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'src/apollo'
import { UpdateProfileMutation } from 'src/apollo/types/UpdateProfileMutation'
import Box from 'src/components/Box'
import * as Form from 'src/components/Form'
import Modal from 'src/components/Modal'
import { useRegisterWithRef } from 'src/utils/form'
import * as yup from 'yup'
import { UPDATE_PROFILE_MUTATION } from './mutations'

interface FormData {
  firstName: string
  middleName?: string
  lastName: string
  headline: string
  phoneNumber: string
  email: string
  bio: string
  website?: string
  position: string
  company: string
}

interface Props {
  isOpen: boolean
  defaultValues: Partial<FormData>
  editIconOnlyBp?: string | null
  onCancel: (data: FormData) => void
  onSave: (data: FormData) => void
  fieldRefs: Record<
    keyof Omit<FormData, 'middleName' | 'lastName'>,
    React.MutableRefObject<any>
  >
}

export default ({
  isOpen,
  defaultValues,
  editIconOnlyBp,
  onCancel,
  onSave,
  fieldRefs,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    watch,
    errors,
    control,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required('Please enter your first name.'),
        middleName: yup.string(),
        lastName: yup.string().required('Please enter your last name.'),
        headline: yup.string(),
        phoneNumber: yup.string(),
        email: yup
          .string()
          .email('Please enter a valid email address.')
          .required('Email is required.'),
        bio: yup.string(),
        website: yup
          .string()
          .url('Please enter a valid URL, starting with https://'),
        position: yup.string(),
        company: yup.string(),
      }),
    ),
  })
  const [updateProfile] = useMutation<UpdateProfileMutation>(
    UPDATE_PROFILE_MUTATION,
  )

  const formFields = watch()

  const registerWithRef = useRegisterWithRef(register)

  const onFormSubmit = React.useCallback(
    async (formData: FormData) => {
      setIsSubmitting(true)
      try {
        const { errors } = await updateProfile({
          variables: {
            updatedUser: formData,
          },
        })
        if (errors == null) {
          onSave(formData)
          // Reset form so pre-filled values are updated on next modal opening
          reset(getValues())
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [updateProfile, onSave, reset, getValues],
  )

  const hasUnsavedChanges = React.useCallback(
    () => !deepEqual(defaultValues, getValues()),
    [defaultValues, getValues],
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onCancel(formFields)}
      confirmClose={hasUnsavedChanges}
      width="calc(min(95%, 800px))"
      header={{
        title: 'Edit your profile',
        subtitle: 'Edit the information you share on your public profile page.',
      }}
      actions={{
        primary: {
          text: 'Save',
          submitForm: 'profile-editor',
          handler: handleSubmit(onFormSubmit),
          isLoading: isSubmitting,
          loadingText: 'Saving',
        },
        secondary: {
          text: 'Cancel',
          close: true,
        },
      }}
    >
      <Box>
        <Box mt={3}>
          <Form.Form onSubmit={handleSubmit(onFormSubmit)} id="profile-editor">
            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              mx={{ base: 0, md: -1 }}
              mb={{ base: 0, md: 3 }}
              sx={{
                '& > *': {
                  flexBasis: 'calc(100% / 3)',
                },
              }}
              overflowY="auto"
            >
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="firstName" required>
                  FIRST NAME
                </Form.Label>
                <Form.Input
                  name="firstName"
                  ref={registerWithRef(fieldRefs.firstName, {
                    required: true,
                  })}
                  type="text"
                  autoComplete="given-name"
                  error={errors.firstName}
                />
                <Form.FieldError fieldError={errors.firstName} />
              </Form.Item>
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="middleName">MIDDLE NAME</Form.Label>
                <Form.Input
                  name="middleName"
                  ref={register({ required: false })}
                  type="text"
                  autoComplete="additional-name"
                  error={errors.middleName}
                />
                <Form.FieldError fieldError={errors.middleName} />
              </Form.Item>
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="lastName" required>
                  LAST NAME
                </Form.Label>
                <Form.Input
                  name="lastName"
                  ref={register({ required: true })}
                  type="text"
                  autoComplete="family-name"
                  error={errors.lastName}
                />
                <Form.FieldError fieldError={errors.lastName} />
              </Form.Item>
            </Box>
            <Form.Item mb={3}>
              <Form.Label>HEADLINE</Form.Label>
              <Form.Input
                name="headline"
                ref={registerWithRef(fieldRefs.headline, { required: false })}
                type="text"
                error={errors.headline}
              />
              <Form.FieldError fieldError={errors.headline} />
            </Form.Item>
            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              mb={{ base: 0, md: 3 }}
              mx={{ base: 0, md: -1 }}
              sx={{
                '& > *': {
                  flexBasis: 'calc(100% / 2)',
                },
              }}
            >
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="phoneNumber">PHONE NUMBER</Form.Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ name, value, onChange, onBlur }) => (
                    <Form.PhoneNumberInput
                      width="100%"
                      name={name}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={errors.phoneNumber}
                    />
                  )}
                />
                <Form.FieldError fieldError={errors.phoneNumber} />
              </Form.Item>
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="email" required>
                  EMAIL
                </Form.Label>
                <Form.Input
                  name="email"
                  ref={registerWithRef(fieldRefs.email, { required: true })}
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                />
                <Form.FieldError fieldError={errors.email} />
              </Form.Item>
            </Box>

            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              mb={{ base: 0, md: 3 }}
              mx={{ base: 0, md: -1 }}
              sx={{
                '& > *': {
                  flexBasis: 'calc(100% / 2)',
                },
              }}
            >
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="position">POSITION</Form.Label>
                <Form.Input
                  name="position"
                  ref={registerWithRef(fieldRefs.position, { required: false })}
                  type="text"
                  autoComplete="organization-title"
                  error={errors.position}
                />
                <Form.FieldError fieldError={errors.position} />
              </Form.Item>
              <Form.Item px={{ base: 0, md: 1 }} mb={{ base: 3, md: 0 }}>
                <Form.Label htmlFor="company">COMPANY</Form.Label>
                <Form.Input
                  name="company"
                  ref={registerWithRef(fieldRefs.company, { required: false })}
                  type="text"
                  autoComplete="organization"
                  error={errors.company}
                />
                <Form.FieldError fieldError={errors.company} />
              </Form.Item>
            </Box>

            <Form.Item>
              <Form.Label htmlFor="bio">BIO</Form.Label>
              <Form.TextArea
                name="bio"
                rows={4}
                ref={registerWithRef(fieldRefs.bio, { required: false })}
                error={errors.bio}
              />
            </Form.Item>
            <Form.FieldError fieldError={errors.bio} />

            <Form.Item>
              <Form.Label htmlFor="website">WEBSITE</Form.Label>
              <Form.Input
                id="website"
                name="website"
                rows={4}
                type="text"
                placeholder="https://my-website.com"
                ref={registerWithRef(fieldRefs.website, {
                  required: false,
                })}
                error={errors.website}
              />
            </Form.Item>
            <Form.FieldError fieldError={errors.website} />
          </Form.Form>
        </Box>
      </Box>
    </Modal>
  )
}
