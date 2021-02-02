import * as React from 'react'
import { gql, useQuery, useMutation } from 'src/apollo'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import { UpdateProfilePictureMutation } from 'src/apollo/types/UpdateProfilePictureMutation'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import BusinessCardImage from 'src/components/BusinessCardImage'
import { Link } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { colors } from 'src/styles'
import { formatName } from 'src/utils/name'
import NameplateEditor from './NameplateEditor'
import ProfileEditor from './ProfileEditor'
import EditableImage from 'src/components/EditableImage'
import ProfilePicture from 'src/components/ProfilePicture'

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

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        _: '4fr 6fr 2fr',
        [bp]: '2fr 3fr 5fr 2fr',
      }}
      gridTemplateRows={{
        _: '',
        [bp]: undefined,
      }}
      gridTemplateAreas={{
        _: `
        "previewButton previewButton previewButton"
        "profilePic nameplate editName"
        "cards cards cards"
        "phoneNumber phoneNumber editProfile"
        "profileInfo profileInfo profileInfo"
      `,
        [bp]: `
        "previewButton previewButton . ."
        "profilePic nameplate nameplate editName"
        "cards phoneNumber phoneNumber editProfile"
        "cards profileInfo profileInfo profileInfo"
    `,
      }}
      gridColumnGap={3}
      gridRowGap={3}
      p={{ _: '24px', md: '48px' }}
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

      <Box gridArea="nameplate" alignSelf={{ _: 'start', md: 'center' }}>
        {data.user.name && (
          <Text.SectionHeader mb={1} mt={0}>
            {formatName(data.user.name)}
          </Text.SectionHeader>
        )}
        <Text.Body2>{data.user.headline}</Text.Body2>
      </Box>

      <Box gridArea="editName" alignSelf="center">
        <NameplateEditor
          editIconOnlyBp={bp}
          defaultValues={{
            firstName: data?.user?.name?.first ?? '',
            middleName: data?.user?.name?.middle ?? '',
            lastName: data?.user?.name?.last ?? '',
            headline: data?.user?.headline ?? '',
          }}
        />
      </Box>

      <Box gridArea="cards">
        {data.user.defaultCardVersion &&
        (data.user.defaultCardVersion.frontImageUrl ||
          data.user.defaultCardVersion.backImageUrl) ? (
          <Box
            width={{ _: '50%', [bp]: '100%' }}
            mb={{ _: 0, [bp]: 2 }}
            mr={{ _: 2, [bp]: 0 }}
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
              <Button variant="secondary" width="100%">
                Get a Nomus card
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box gridArea="phoneNumber">
        <Box>
          <Text.Label mb={1}>PHONE</Text.Label>
          <Text.Body2>
            <Link to={`tel:${data.user.phoneNumber}`}>
              {data.user.phoneNumber}
            </Link>
          </Text.Body2>
        </Box>
      </Box>

      <Box gridArea="profileInfo">
        <Box mb={3}>
          <Text.Label>EMAIL</Text.Label>
          <Text.Body2>
            <Link to={`mailto:${data.user.email}`}>{data.user.email}</Link>
          </Text.Body2>
        </Box>

        <Box mb={4}>
          <Text.Label>BIO</Text.Label>
          <Text.Body2>{data.user.bio}</Text.Body2>
        </Box>
      </Box>

      <Box
        gridArea="previewButton"
        justifySelf={{ _: 'stretch', [bp]: 'stretch' }}
      >
        <Link
          display="inline-block"
          width="100%"
          to={`/${data.user.username}`}
          asButton
          buttonStyle="secondary"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text.Body2 color="linkBlue">{`nomus.com/${data.user.username}`}</Text.Body2>
            <SVG.ExternalLink color={colors.linkBlue} />
          </Box>
        </Link>
      </Box>

      <Box gridArea="editProfile">
        <ProfileEditor
          editIconOnlyBp={bp}
          defaultValues={{
            phoneNumber: data?.user.phoneNumber ?? '',
            email: data?.user.email ?? '',
            bio: data?.user.bio ?? '',
          }}
        />
      </Box>
    </Box>
  )
}
