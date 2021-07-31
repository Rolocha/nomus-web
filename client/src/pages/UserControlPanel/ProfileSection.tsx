import * as React from 'react'
import { gql, useMutation, useQuery } from 'src/apollo'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import { UpdateProfilePictureMutation } from 'src/apollo/types/UpdateProfilePictureMutation'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import Button from 'src/components/Button'
import EditableImage from 'src/components/EditableImage'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import ProfilePicture from 'src/components/ProfilePicture'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { colors } from 'src/styles'
import { formatName } from 'src/utils/name'
import { formatPhoneNumber } from 'react-phone-number-input'
import ProfileEditorModal from './ProfileEditorModal'

const bp = 'md'

export default () => {
  const { loading, data } = useQuery<UCPProfileSectionQuery>(
    gql`
      query UCPProfileSectionQuery {
        user {
          id
          username
          name {
            first
            middle
            last
          }
          defaultCardVersion {
            id
            frontImageUrl
            backImageUrl
          }
          profilePicUrl
          headline
          phoneNumber
          email
          bio
          position
          company
        }
      }
    `,
  )

  const [updateProfilePicture] = useMutation<UpdateProfilePictureMutation>(
    gql`
      mutation UpdateProfilePictureMutation($file: Upload!) {
        updateProfilePicture(file: $file) {
          id
          profilePicUrl
        }
      }
    `,
  )

  const handleProfilePictureUpdate = async (image: File) => {
    await updateProfilePicture({
      variables: {
        file: image,
      },
    })
  }

  const [isProfileEditorOpen, setIsProfileEditorOpen] = React.useState(false)

  const openProfileEditorModal = React.useCallback(() => {
    setIsProfileEditorOpen(true)
  }, [setIsProfileEditorOpen])

  const closeProfileEditorModal = React.useCallback(() => {
    setIsProfileEditorOpen(false)
  }, [setIsProfileEditorOpen])

  const firstNameFieldRef = React.useRef<HTMLInputElement | null>(null)
  const headlineFieldRef = React.useRef<HTMLInputElement | null>(null)
  const phoneNumberFieldRef = React.useRef<HTMLInputElement | null>(null)
  const emailFieldRef = React.useRef<HTMLInputElement | null>(null)
  const bioFieldRef = React.useRef<HTMLInputElement | null>(null)
  const positionFieldRef = React.useRef<HTMLInputElement | null>(null)
  const companyFieldRef = React.useRef<HTMLInputElement | null>(null)

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '4fr 6fr 2fr',
        [bp]: '2fr 3fr 5fr 2fr',
      }}
      gridTemplateRows={{
        base: '',
        [bp]: undefined,
      }}
      gridTemplateAreas={{
        base: `
        "topBar topBar topBar"
        "profilePic nameplate nameplate"
        "cards cards cards"
        "profileInfo profileInfo profileInfo"
      `,
        [bp]: `
        "topBar topBar topBar topBar"
        "profilePic nameplate nameplate nameplate"
        "cards profileInfo profileInfo profileInfo"
    `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
      p={{ base: '24px', [bp]: '48px' }}
    >
      <Box
        gridArea="topBar"
        justifySelf={{ base: 'stretch', [bp]: 'stretch' }}
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Link
          display="inline-block"
          px="24px"
          to={`/${data.user.username}`}
          buttonStyle="secondary"
          target="_blank"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text.Body2 color="linkBlue">{`nomus.me/${data.user.username}`}</Text.Body2>
            <Icon of="externalLink" color={colors.linkBlue} />
          </Box>
        </Link>
        <Box display={{ base: 'none', [bp]: 'block' }}>
          <Button
            variant="tertiary"
            leftIcon={<Icon of="pen" />}
            onClick={openProfileEditorModal}
          >
            <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
              Edit profile
            </Box>
          </Button>
        </Box>
      </Box>

      <Box gridArea="profilePic" placeSelf="center" width="100%">
        {data.user.name && (
          <EditableImage
            editable
            src={data.user.profilePicUrl}
            fallbackImage={<ProfilePicture name={data.user.name} />}
            onImageUpdate={handleProfilePictureUpdate}
          />
        )}
      </Box>

      <Box gridArea="nameplate" alignSelf={{ base: 'start', [bp]: 'center' }}>
        {data.user.name ? (
          <Text.SectionHeader mb={1} mt={0}>
            {formatName(data.user.name)}
          </Text.SectionHeader>
        ) : (
          // This should virtually never be seen since the user should have a name when they sign up and can't remove it but including it just to be safe.
          <Form.FieldPrompt
            modalOpener={openProfileEditorModal}
            fieldRef={firstNameFieldRef}
          >
            <Text.SectionHeader mb={1} mt={0}>
              Enter your name.
            </Text.SectionHeader>
          </Form.FieldPrompt>
        )}
        {data.user.headline ? (
          <Text.Body2>{data.user.headline}</Text.Body2>
        ) : (
          <Form.FieldPrompt
            modalOpener={openProfileEditorModal}
            fieldRef={headlineFieldRef}
          >
            Add a descriptive headline to let the world know who you are.
          </Form.FieldPrompt>
        )}
      </Box>

      <Box gridArea="cards">
        {data.user.defaultCardVersion &&
        (data.user.defaultCardVersion.frontImageUrl ||
          data.user.defaultCardVersion.backImageUrl) ? (
          <Box
            width={{ base: '50%', [bp]: '100%' }}
            mb={{ base: 0, [bp]: 2 }}
            mr={{ base: 2, [bp]: 0 }}
          >
            <BusinessCardImage
              width="100%"
              frontImageUrl={data.user.defaultCardVersion.frontImageUrl}
              backImageUrl={data.user.defaultCardVersion.backImageUrl}
            />
          </Box>
        ) : (
          // User has no defaultCardVersion, show the placeholder and a button to get Nomus card
          <Box
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            justifyContent="flex-start"
          >
            <BusinessCardImage width="100%" placeholder />
            <Box mt={2} flexGrow={0}>
              <Link buttonStyle="secondary" to="/shop">
                Get a Nomus card
              </Link>
            </Box>
          </Box>
        )}
      </Box>

      <Box gridArea="profileInfo" position="relative">
        <Box
          display={{ base: 'block', [bp]: 'none' }}
          position="absolute"
          right="0px"
          top="0px"
        >
          <Button
            variant="tertiary"
            leftIcon={<Icon of="pen" />}
            onClick={openProfileEditorModal}
          >
            <Box as="span" display={{ base: 'none', [bp]: 'inline' }}>
              Edit
            </Box>
          </Button>
        </Box>

        <Box mb={3}>
          <Text.Label mb={1}>ROLE</Text.Label>
          {data.user.company ? (
            <Text.Body2>{data.user.company}</Text.Body2>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={phoneNumberFieldRef}
            >
              {formatPhoneNumber('+15551234567')}
            </Form.FieldPrompt>
          )}
        </Box>
        <Box mb={3}>
          <Text.Label mb={1}>PHONE</Text.Label>
          {data.user.phoneNumber ? (
            <Text.Body2>
              <Link to={`tel:${data.user.phoneNumber}`}>
                {formatPhoneNumber(data.user.phoneNumber)}
              </Link>
            </Text.Body2>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={phoneNumberFieldRef}
            >
              {formatPhoneNumber('+15551234567')}
            </Form.FieldPrompt>
          )}
        </Box>
        <Box mb={3}>
          <Text.Label>EMAIL</Text.Label>
          {data.user.email ? (
            <Text.Body2>
              <Link to={`mailto:${data.user.email}`}>{data.user.email}</Link>
            </Text.Body2>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={emailFieldRef}
            >
              Enter the e-mail address you'd like to share with your contacts.
            </Form.FieldPrompt>
          )}
        </Box>

        <Box mb={3}>
          <Text.Label>BIO</Text.Label>
          {data.user.bio ? (
            <Text.Body2>{data.user.bio}</Text.Body2>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={bioFieldRef}
            >
              This is your time to shine. Tell us all about what makes you, you.
            </Form.FieldPrompt>
          )}
        </Box>
      </Box>

      <ProfileEditorModal
        isOpen={isProfileEditorOpen}
        editIconOnlyBp={bp}
        onCancel={closeProfileEditorModal}
        onSave={closeProfileEditorModal}
        defaultValues={{
          firstName: data?.user?.name?.first ?? '',
          middleName: data?.user?.name?.middle ?? '',
          lastName: data?.user?.name?.last ?? '',
          phoneNumber: data?.user.phoneNumber ?? '',
          email: data?.user.email ?? '',
          bio: data?.user.bio ?? '',
          headline: data?.user.headline ?? '',
        }}
        fieldRefs={{
          firstName: firstNameFieldRef,
          headline: headlineFieldRef,
          phoneNumber: phoneNumberFieldRef,
          email: emailFieldRef,
          bio: bioFieldRef,
          position: positionFieldRef,
          company: companyFieldRef,
        }}
      />
    </Box>
  )
}
