import * as React from 'react'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
// import { UCPContactsSectionQuery } from 'src/apollo/types/UCPContactsSectionQuery'
import Box from 'src/components/Box'
import LoadingPage from 'src/pages/LoadingPage'
import { Contact } from 'src/types/contact'
import ContactsDetailView from './ContactsDetailView'
import ContactsGlanceView from './ContactsGlanceView'
import ContactsViewMenuBar from './ContactsViewMenuBar'

const bp = 'lg'

const data: {
  contacts: Contact[]
} = {
  contacts: [
    {
      id: '1',
      username: 'hanad',
      name: {
        first: 'Hanad',
        last: 'Musa',
      },
      phoneNumber: '4084318168',
      email: 'nomus@me.com',
      headline: 'COO at Place',
      bio: 'hi it me',
      profilePic: 'http://via.placeholder.com/300x300',

      cardFrontImageUrl: 'http://via.placeholder.com/500x300',
      cardBackImageUrl: 'http://via.placeholder.com/500x300',
      notes: 'he seemed cool',
      vcfUrl: 'http://via.placeholder.com/500x300',
      meetingDate: new Date('2020-05-21T04:05:25.850Z'),
    },
    {
      id: '2',
      username: 'anshul',
      name: {
        first: 'Anshul',
        last: 'Aggarwal',
      },
      phoneNumber: '4084318168',
      email: 'nomus@me.com',
      headline: 'CEO at Place',
      bio: 'hi it me',
      profilePic: 'http://via.placeholder.com/300x300',

      cardFrontImageUrl: 'http://via.placeholder.com/500x300',
      cardBackImageUrl: 'http://via.placeholder.com/500x300',
      notes: 'he seemed cool',
      vcfUrl: 'http://via.placeholder.com/500x300',
      meetingDate: new Date('2020-05-21T04:06:25.850Z'),
    },
    {
      id: '3',
      username: 'arthur',
      name: {
        first: 'Arthur',
        last: 'Aardvark',
      },
      phoneNumber: '4084318168',
      email: 'nomus@me.com',
      headline: 'Chief Aardvark',
      bio: 'hi it me',
      profilePic: 'http://via.placeholder.com/300x300',

      cardFrontImageUrl: 'http://via.placeholder.com/500x300',
      cardBackImageUrl: 'http://via.placeholder.com/500x300',
      notes: 'he seemed cool',
      vcfUrl: 'http://via.placeholder.com/500x300',
      meetingDate: new Date('2020-05-21T04:06:25.850Z'),
    },
    {
      id: '4',
      username: 'cindy',
      name: {
        first: 'Cindy',
        last: 'Cheung',
      },
      phoneNumber: '4084318168',
      email: 'nomus@me.com',
      headline: 'CDO at Place',
      bio: 'hi it me',
      profilePic: 'http://via.placeholder.com/300x300',

      cardFrontImageUrl: 'http://via.placeholder.com/500x300',
      cardBackImageUrl: 'http://via.placeholder.com/500x300',
      notes: 'he seemed cool',
      vcfUrl: 'http://via.placeholder.com/500x300',
      meetingDate: new Date('2020-05-20T04:06:25.850Z'),
    },
  ],
}

function nextChar(c: string) {
  return c === 'z'
    ? 'a'
    : c === 'Z'
    ? 'A'
    : String.fromCharCode(c.charCodeAt(0) + 1)
}

for (let i = 0; i < 20; i += 1) {
  const lastContact = data.contacts[data.contacts.length - 1]
  const newMeetingDate = new Date(
    lastContact.meetingDate.getTime() + 1000 * 60 * 60 * 4,
  )
  data.contacts.push({
    ...lastContact,
    id: lastContact.id,
    username: lastContact.username.split('').map(nextChar).join(''),
    name: {
      first: lastContact.name.first.split('').map(nextChar).join(''),
      middle: lastContact.name.middle,
      last: lastContact.name.last.split('').map(nextChar).join(''),
    },
    meetingDate: newMeetingDate,
  })
}

export default () => {
  const routeMatch = useRouteMatch()
  const history = useHistory()
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

  const loading = false
  if (loading || !data) {
    return <LoadingPage />
  }

  const locationSearch = history.location.search
    .substr(1)
    .split('&')
    .map((pair) => pair.split('='))
  const contactSearchQueryPair = locationSearch.find(
    (pair) => pair[0] === 'search',
  )
  const contactSearchQuery = contactSearchQueryPair
    ? contactSearchQueryPair[1]
    : ''

  return (
    <Box>
      <Box mb={3}>
        <ContactsViewMenuBar
          searchQueryValue={contactSearchQuery}
          onChangeSearchQueryValue={(newValue) => {
            history.replace(
              `${history.location.pathname}${
                newValue ? `?search=${newValue}` : ''
              }`,
            )
          }}
        />
      </Box>
      <Switch>
        <Route path={`${routeMatch.url}/glance`}>
          <ContactsGlanceView
            contacts={data.contacts}
            searchQueryValue={contactSearchQuery}
          />
        </Route>
        <Route path={`${routeMatch.url}/detail/:usernameOrId?`}>
          <ContactsDetailView
            contacts={data.contacts}
            searchQueryValue={contactSearchQuery}
          />
        </Route>
        <Route>
          <Redirect to={`${routeMatch.url}/glance`} />
        </Route>
      </Switch>
    </Box>
  )
}
