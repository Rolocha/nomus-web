import { css } from '@emotion/core'
import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import { UCPProfileSectionQuery } from 'src/apollo/types/UCPProfileSectionQuery'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { InternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import { mq } from 'src/styles/breakpoints'
import { formatName } from 'src/utils/name'
import NameplateEditor from './NameplateEditor'
import ProfileEditor from './ProfileEditor'

const bp = 'lg'

export default () => {
  // const [isEditingProfile, setIsEditingProfile] = React.useState(false)

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
        [bp]: '2fr 8fr 2fr',
      }}
      gridTemplateRows={{
        _: '',
        [bp]: 'auto 1fr',
      }}
      gridTemplateAreas={{
        _: `
        "profilePic nameplate editName"
        "cards cards cards"
        "profileInfo profileInfo editProfile"
        "previewButton previewButton previewButton"
      `,
        [bp]: `
      "profilePic nameplate editName"
      "cards profileInfo editProfile"
      ". previewButton ."
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
        <Text.Body>{data.user.headline}</Text.Body>
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
            <Box width={{ _: '50%', [bp]: '100%' }} mb={2}>
              <Image width="100%" src={data.cardVersion.frontImageUrl} />
            </Box>
          )}
          {data.cardVersion.backImageUrl && (
            <Box width={{ _: '50%', [bp]: '100%' }}>
              {/* Back of business card */}
              <Image width="100%" src={data.cardVersion.backImageUrl} />
            </Box>
          )}
        </Box>
      )}

      <Box gridArea="profileInfo">
        <Box mb={3}>
          <Text.Label mb={1}>PHONE</Text.Label>
          <Text.Body>{data.user.phoneNumber}</Text.Body>
        </Box>

        <Box mb={3}>
          <Text.Label>EMAIL</Text.Label>
          <Text.Body>{data.user.email}</Text.Body>
        </Box>

        <Box mb={4}>
          <Text.Label>BIO</Text.Label>
          <Text.Body>{data.user.bio}</Text.Body>
        </Box>
      </Box>

      <InternalLink
        css={css`
          grid-area: previewButton;
          justify-self: stretch;
          ${mq[bp]} {
            justify-self: start;
          }
        `}
        to={`/u/${data.user.username}`}
        asButton
        buttonStyle="secondaryOutline"
      >
        Preview public profile
      </InternalLink>

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
