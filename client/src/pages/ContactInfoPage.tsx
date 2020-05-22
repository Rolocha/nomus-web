import * as React from 'react'
import { useParams, useHistory, Link } from 'react-router-dom'

import { useQuery, gql } from 'src/apollo'
import LoadingPage from 'src/pages/LoadingPage'
import {
  ContactPageQuery,
  ContactPageQueryVariables,
} from 'src/apollo/types/ContactPageQuery'
import Container from 'src/components/Container'
import Box from 'src/components/Box'
import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Navbar from 'src/components/Navbar'
import { downloadFile } from 'src/utils/download'

interface UrlParams {
  username?: string
  cardNameOrId?: string
}

const ContactInfoPage = () => {
  const { username, cardNameOrId }: UrlParams = useParams()
  const history = useHistory()

  // If there's no username in the route, this is an invalid route, redirect to the landing page
  if (username == null) {
    history.push('/')
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { loading, data, error } = useQuery<
    ContactPageQuery,
    ContactPageQueryVariables
  >(
    gql`
      query ContactPageQuery($username: String!, $cardNameOrId: String) {
        contactInfo(username: $username, cardNameOrId: $cardNameOrId) {
          imageUrl
          vcfUrl
          name {
            first
            middle
            last
          }
        }
      }
    `,
    {
      variables: {
        username,
        cardNameOrId,
      },
    },
  )

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    history.push('/')
    return null
  }

  return data ? (
    <Box>
      <Navbar />
      <Container
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        justifyContent="flex-start"
        minHeight="100vh"
        bg="white"
        position="relative"
      >
        <Image src={data.contactInfo.imageUrl} alt="business card" />
        <Button
          variant="primary"
          type="submit"
          onClick={() => downloadFile(data.contactInfo.vcfUrl)}
        >
          Save contact
        </Button>
        <Button variant="primary">
          <Link
            to={`/save/${username}${cardNameOrId ? `/>${cardNameOrId}` : ''}`}
          >
            Save to Nomus
          </Link>
        </Button>
      </Container>
    </Box>
  ) : null
}

export default ContactInfoPage
