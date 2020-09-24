import * as React from 'react'
import { gql, useQuery, useMutation } from 'src/apollo'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import { UpdateProfilePictureMutation } from 'src/apollo/types/UpdateProfilePictureMutation'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import { InternalLink } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { colors } from 'src/styles'
import { formatName } from 'src/utils/name'
import NameplateEditor from './NameplateEditor'
import ProfileEditor from './ProfileEditor'
import EditableImage from 'src/components/EditableImage'

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
        [bp]: 'auto 1fr',
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
      <Box gridArea="profilePic">
        <EditableImage
          editable
          src={data.user.profilePicUrl ?? 'http://via.placeholder.com/500x300'}
          width="100%"
          onImageUpdate={handleProfilePictureUpdate}
        />
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

      {data.user.defaultCardVersion && (
        <Box
          gridArea="cards"
          display="flex"
          flexDirection={{ _: 'row', [bp]: 'column' }}
          alignItems={{ _: 'center', [bp]: 'flex-end' }}
          flexShrink={0}
        >
          {/* Front of business card */}
          {data.user.defaultCardVersion.frontImageUrl && (
            <Box
              width={{ _: '50%', [bp]: '100%' }}
              mb={{ _: 0, [bp]: 2 }}
              mr={{ _: 2, [bp]: 0 }}
            >
              <BusinessCardImage
                width="100%"
                frontImageUrl={data.user.defaultCardVersion.frontImageUrl}
              />
            </Box>
          )}
          {data.user.defaultCardVersion.backImageUrl && (
            <Box width={{ _: '50%', [bp]: '100%' }}>
              {/* Back of business card */}
              <BusinessCardImage
                width="100%"
                backImageUrl={data.user.defaultCardVersion.backImageUrl}
              />
            </Box>
          )}
        </Box>
      )}

      <Box gridArea="phoneNumber">
        <Box>
          <Text.Label mb={1}>PHONE</Text.Label>
          <Text.Body2>{data.user.phoneNumber}</Text.Body2>
        </Box>
      </Box>

      <Box gridArea="profileInfo">
        <Box mb={3}>
          <Text.Label>EMAIL</Text.Label>
          <Text.Body2>{data.user.email}</Text.Body2>
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
        <InternalLink
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
        </InternalLink>
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
