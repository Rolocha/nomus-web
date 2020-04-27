import * as React from 'react'

import { useQuery, gql } from 'src/apollo'
import Container from 'src/components/Container'
import LoadingPage from 'src/pages/LoadingPage'

interface UserResponse {}

const LoginPage = () => {
  const { loading, data } = useQuery<UserResponse>(
    gql`
      query currentUser {
        currentUser {
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
      {JSON.stringify(data)}
    </Container>
  )
}

export default LoginPage
