import { FormControl, Switch, Tooltip } from '@chakra-ui/react'
import * as React from 'react'
import { formatPhoneNumber } from 'react-phone-number-input'
import { gql, useMutation, useQuery } from 'src/apollo'
import { NomusProFeature } from 'src/apollo/types/globalTypes'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import { UpdateNomusProFeatureSet } from 'src/apollo/types/UpdateNomusProFeatureSet'
import { UpdateProfilePictureMutation } from 'src/apollo/types/UpdateProfilePictureMutation'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import Button from 'src/components/Button'
import EditableImage from 'src/components/EditableImage'
import * as Form from 'src/components/Form'
import Icon from 'src/components/Icon'
import Link from 'src/components/Link'
import NomusProBadge from 'src/components/NomusProBadge'
import NomusProModal from 'src/components/NomusProModal'
import ProfilePicture from 'src/components/ProfilePicture'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { UPDATE_NOMUS_PRO_FEATURES } from 'src/pages/UserControlPanel/mutations'
import { colors } from 'src/styles'
import { formatName } from 'src/utils/name'
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
          website
        }

        nomusProAccessInfo {
          id
          hasAccessUntil
          featureSet {
            UseCustomTapLink
          }
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

  const [
    updateNomusProFeatureSet,
    updateNomusProFeatureSetResult,
  ] = useMutation<UpdateNomusProFeatureSet>(UPDATE_NOMUS_PRO_FEATURES)

  const handleProfilePictureUpdate = async (image: File) => {
    await updateProfilePicture({
      variables: {
        file: image,
      },
    })
  }

  const [isNomusProModalOpen, setIsNomusProModalOpen] = React.useState(false)

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
  const websiteFieldRef = React.useRef<HTMLInputElement | null>(null)

  const hasNomusProAccess = React.useMemo(() => {
    if (data?.nomusProAccessInfo?.hasAccessUntil == null) {
      return false
    }
    const hasAccessUntil = new Date(
      data?.nomusProAccessInfo?.hasAccessUntil * 1000,
    ).getTime()
    const now = new Date().getTime()
    return hasAccessUntil > now
  }, [data])

  const handleRouteTapsToWebsiteSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // If user is trying to toglge on the custom link routing feature
    // but doesn't have Nomus Pro access yet, open the modal prompting
    // them to subscribe
    if (event.target.checked && !hasNomusProAccess) {
      setIsNomusProModalOpen(true)
    } else {
      // Looks like they do have access: fire off the mutation to turn the
      // feature on for them
      updateNomusProFeatureSet({
        variables: {
          featureSetUpdate: {
            UseCustomTapLink: event.target.checked,
          },
        },
      })
    }
  }

  const useCustomLinkRouting =
    hasNomusProAccess &&
    data?.nomusProAccessInfo?.featureSet?.UseCustomTapLink &&
    data?.user.website

  const cardTapLink = useCustomLinkRouting
    ? { url: data!.user.website, label: data!.user.website }
    : {
        url: `/${data?.user.username}`,
        label: `nomus.me/${data?.user.username}`,
      }

  const cardTapLinkExplanation = useCustomLinkRouting
    ? `Because you're subscribed to Nomus Pro and have enabled custom link routing, when someone taps your Nomus card or scans the QR code, they will be sent directly to your website.`
    : `When someone taps your Nomus card or scans the QR code, they will be sent to your Nomus profile page.`

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
        "profilePic nameplate nameplate"
        "cards cards cards"
        "profileInfo profileInfo profileInfo"
      `,
        [bp]: `
        "profilePic nameplate nameplate editProfile"
        "cards profileInfo profileInfo profileInfo"
    `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
      p={{ base: '24px', [bp]: '48px' }}
    >
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

      <Box
        gridArea="nameplate"
        alignSelf={{ base: 'start', [bp]: 'center' }}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        {/* Tap/scan route indicator */}
        <Box>
          <Tooltip
            hasArrow
            placement="top"
            label={cardTapLinkExplanation}
            aria-label={cardTapLinkExplanation}
          >
            <span>
              <Link
                to={cardTapLink.url}
                target="_blank"
                display="flex"
                alignItems="center"
              >
                <Icon of="nfc" mr="4px" color={colors.linkBlue} />
                <Text.Body2 color={colors.linkBlue}>
                  {cardTapLink.label}
                </Text.Body2>
              </Link>
            </span>
          </Tooltip>
        </Box>
        {data.user.name ? (
          <Box
            display="flex"
            flexDirection={{ base: 'column', [bp]: 'row' }}
            alignItems={{ base: 'flex-start', [bp]: 'center' }}
          >
            <Text.SectionHeader mb={1} mt={0}>
              {formatName(data.user.name)}
            </Text.SectionHeader>

            {hasNomusProAccess && (
              <Box ml={{ base: 0, [bp]: '8px' }}>
                <NomusProBadge />
              </Box>
            )}
          </Box>
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

      <Box gridArea="editProfile" display={{ base: 'none', [bp]: 'block' }}>
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
          <Text.Label>
            {data.user.position == null && data.user.company == null
              ? 'Position/Company'
              : [
                  data.user.position && 'POSITION',
                  data.user.company && 'COMPANY',
                ]
                  .filter(Boolean)
                  .join('/')}
          </Text.Label>
          {data.user.position || data.user.company ? (
            <Text.Body2>
              {[data.user.position, data.user.company]
                .filter(Boolean)
                .join(' @ ')}
            </Text.Body2>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={companyFieldRef}
            >
              Let people know where you work
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

        <Box mb={3}>
          <Text.Label>Website</Text.Label>
          {data.user.website ? (
            <Box>
              <Text.Body2>
                <Link to={data.user.website}>{data.user.website}</Link>
              </Text.Body2>
              <FormControl display="flex" alignItems="center" mt="4px">
                <Switch
                  onChange={handleRouteTapsToWebsiteSwitchChange}
                  isDisabled={updateNomusProFeatureSetResult.loading}
                  isChecked={
                    data?.nomusProAccessInfo?.featureSet?.UseCustomTapLink ??
                    false
                  }
                  id="custom-tap-route"
                />
                <Text.Body3 as="label" htmlFor="custom-tap-route" ml="4px">
                  Send my contacts here when they tap my cards.
                </Text.Body3>
              </FormControl>
            </Box>
          ) : (
            <Form.FieldPrompt
              modalOpener={openProfileEditorModal}
              fieldRef={websiteFieldRef}
            >
              Add a website
            </Form.FieldPrompt>
          )}
        </Box>
      </Box>

      {/* No need to even invisibly render the NomusPro modal if the user already has access  */}
      {!hasNomusProAccess && (
        <NomusProModal
          triggerFeature={NomusProFeature.UseCustomTapLink}
          isOpen={isNomusProModalOpen}
          onCancel={() => setIsNomusProModalOpen(false)}
        />
      )}

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
          website: data?.user.website ?? '',
          position: data?.user.position ?? '',
          company: data?.user.company ?? '',
        }}
        fieldRefs={{
          firstName: firstNameFieldRef,
          headline: headlineFieldRef,
          phoneNumber: phoneNumberFieldRef,
          email: emailFieldRef,
          bio: bioFieldRef,
          website: websiteFieldRef,
          position: positionFieldRef,
          company: companyFieldRef,
        }}
      />
    </Box>
  )
}
