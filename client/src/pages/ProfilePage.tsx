import * as React from 'react'

import { useQuery, gql } from 'apollo'
import Container from 'components/Container'
import LoadingPage from 'pages/LoadingPage'

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
          phoneNumber {
            cell
          }
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
