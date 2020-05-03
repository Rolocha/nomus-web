import * as React from 'react'

import { useQuery, gql } from 'src/apollo'
import { ProfilePageQuery } from 'src/apollo/types/ProfilePageQuery'
import Container from 'src/components/Container'
import LoadingPage from 'src/pages/LoadingPage'

const ProfilePage = () => {
  const { loading, data } = useQuery<ProfilePageQuery>(
    gql`
      query ProfilePageQuery {
        user {
          name {
            first
            last
          }
          email
          phoneNumber
        }
      }
    `,
  )

  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Container
      display="flex"
      justifyContent="center"
      minHeight="100vh"
      bg="white"
      position="relative"
    >
      {JSON.stringify(data.user)}
    </Container>
  )
}

export default ProfilePage
