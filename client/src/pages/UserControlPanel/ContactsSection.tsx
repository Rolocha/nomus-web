import * as React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
// import { UCPContactsSectionQuery } from 'src/apollo/types/UCPContactsSectionQuery'
import Box from 'src/components/Box'
import LoadingPage from 'src/pages/LoadingPage'
import ContactsDetailView from './ContactsDetailView'
import ContactsGlanceView from './ContactsGlanceView'

const bp = 'lg'

export default () => {
  const routeMatch = useRouteMatch()
  //   const { loading } = useQuery(
  //     gql`
  //       query UCPContactsSectionQuery {
  //         contacts {
  //             username
  //             name {
  //                 first
  //                 middle
  //                 last
  //             }
  //             phone
  //             email
  //             headline
  //             bio
  //             profilePic

  //             cardFrontImageUrl
  //             cardBackImageUrl
  //             notes
  //             vcfUrl
  //           }
  //     `,
  //   )

  // Fake data for now since making connections is hard :(
  const data = {
    contacts: [
      {
        username: 'bibek',
        name: {
          first: 'Bibek',
          last: 'Ghimire',
        },
        phone: '4084318168',
        email: 'nomus@me.com',
        headline: 'CTO at Place',
        bio: 'hi it me',
        profilePic: 'http://via.placeholder.com/300x300',

        cardFrontImageUrl: 'http://via.placeholder.com/500x300',
        cardBackImageUrl: 'http://via.placeholder.com/500x300',
        notes: 'he seemed cool',
        vcfUrl: 'http://via.placeholder.com/500x300',
      },
      {
        username: 'anshul',
        name: {
          first: 'Anshul',
          last: 'Aggarwal',
        },
        phone: '4084318168',
        email: 'nomus@me.com',
        headline: 'CTO at Place',
        bio: 'hi it me',
        profilePic: 'http://via.placeholder.com/300x300',

        cardFrontImageUrl: 'http://via.placeholder.com/500x300',
        cardBackImageUrl: 'http://via.placeholder.com/500x300',
        notes: 'he seemed cool',
        vcfUrl: 'http://via.placeholder.com/500x300',
      },
      {
        username: 'cindy',
        name: {
          first: 'Cindy',
          last: 'Cheung',
        },
        phone: '4084318168',
        email: 'nomus@me.com',
        headline: 'CTO at Place',
        bio: 'hi it me',
        profilePic: 'http://via.placeholder.com/300x300',
        cardFrontImageUrl: 'http://via.placeholder.com/500x300',
        cardBackImageUrl: 'http://via.placeholder.com/500x300',
        notes: 'he seemed cool',
        vcfUrl: 'http://via.placeholder.com/500x300',
      },
    ],
  }

  const loading = false
  if (loading || !data) {
    return <LoadingPage />
  }

  return (
    <Box>
      <Switch>
        <Route path={`${routeMatch.url}/glance`}>
          <ContactsGlanceView />
        </Route>
        <Route path={`${routeMatch.url}/detail/:usernameOrId?`}>
          <ContactsDetailView />
        </Route>
        <Route>
          <Redirect to={`${routeMatch.url}/glance`} />
        </Route>
      </Switch>
    </Box>
  )
}
