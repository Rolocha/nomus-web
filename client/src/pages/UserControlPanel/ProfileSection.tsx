import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { InternalLink } from 'src/components/Link'
import * as SVG from 'src/components/SVG'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { colors } from 'src/styles'
import { formatName } from 'src/utils/name'
import NameplateEditor from './NameplateEditor'
import ProfileEditor from './ProfileEditor'

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
          profilePicUrl
          headline
          phoneNumber
          email
          bio
        }

        cardVersion {
          frontImageUrl
          backImageUrl
        }
      }
    `,
  )

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
        "profileInfo profileInfo editProfile"
      `,
        [bp]: `
        "previewButton previewButton . ."
        "profilePic nameplate nameplate editName"
        "cards profileInfo profileInfo editProfile"
    `,
      }}
      gridColumnGap={2}
      gridRowGap={3}
    >
      <Box gridArea="profilePic">
        <Image
          width="100%"
          borderRadius="50%"
          src={data.user.profilePicUrl ?? 'http://via.placeholder.com/500x300'}
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

      {data.cardVersion && (
        <Box
          gridArea="cards"
          display="flex"
          flexDirection={{ _: 'row', [bp]: 'column' }}
          alignItems={{ _: 'center', [bp]: 'flex-end' }}
          pr={3}
          flexShrink={0}
        >
          {/* Front of business card */}
          {data.cardVersion.frontImageUrl && (
            <Box
              width={{ _: '50%', [bp]: '100%' }}
              mb={{ _: 0, [bp]: 2 }}
              mr={{ _: 2, [bp]: 0 }}
            >
              <Image
                boxShadow={0}
                width="100%"
                src={data.cardVersion.frontImageUrl}
              />
            </Box>
          )}
          {data.cardVersion.backImageUrl && (
            <Box width={{ _: '50%', [bp]: '100%' }}>
              {/* Back of business card */}
              <Image
                boxShadow={0}
                width="100%"
                src={data.cardVersion.backImageUrl}
              />
            </Box>
          )}
        </Box>
      )}

      <Box gridArea="profileInfo">
        <Box mb={3}>
          <Text.Label mb={1}>PHONE</Text.Label>
          <Text.Body2>{data.user.phoneNumber}</Text.Body2>
        </Box>

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
          to={`/u/${data.user.username}`}
          asButton
          buttonStyle="secondary"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={2}
          >
            <Text.Body2 color="linkBlue">{`nomus.com/u/${data.user.username}`}</Text.Body2>
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
