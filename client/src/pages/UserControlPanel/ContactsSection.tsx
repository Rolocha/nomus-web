import * as React from 'react'
import {
  Redirect,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import Box from 'src/components/Box'
import LoadingPage from 'src/pages/LoadingPage'
import { ContactsSortOption } from './contact-sorting'
import ContactsDetailView from './ContactsDetailView'
import ContactsGlanceView from './ContactsGlanceView'
import ContactsViewMenuBar from './ContactsViewMenuBar'
import { UCPContactsSectionQuery } from 'src/apollo/types/UCPContactsSectionQuery'

interface ParamsType {
  viewMode?: string
  usernameOrId?: string
}

const isValidViewMode = (viewMode: string): viewMode is 'glance' | 'detail' => {
  return viewMode === 'glance' || viewMode === 'detail'
}

const getDefaultSortOptionForViewMode = (viewMode: string | undefined) =>
  viewMode && isValidViewMode(viewMode)
    ? {
        detail: ContactsSortOption.Alphabetical,
        glance: ContactsSortOption.MeetingDateNewest,
      }[viewMode]
    : ContactsSortOption.MeetingDateNewest

export default () => {
  const params = useParams<ParamsType>()
  const { viewMode } = params
  const lastViewMode = React.useRef(viewMode)
  const [contactSortOption, setContactSortOption] = React.useState(
    getDefaultSortOptionForViewMode(viewMode),
  )
  const rootRouteMatch = useRouteMatch({
    path: '/dashboard/contacts',
    exact: true,
  })
  const history = useHistory()

  React.useEffect(() => {
    if (lastViewMode.current == null) {
      setContactSortOption(getDefaultSortOptionForViewMode(viewMode))
    }
    lastViewMode.current = viewMode
  }, [viewMode, lastViewMode])

  const { loading, data } = useQuery<UCPContactsSectionQuery>(
    gql`
      query UCPContactsSectionQuery {
        contacts {
          id
          username
          name {
            first
            middle
            last
          }
          phoneNumber
          email
          headline
          bio
          profilePicUrl

          cardFrontImageUrl
          cardBackImageUrl
          notes
          vcfUrl

          meetingPlace
          meetingDate
        }
      }
    `,
  )

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
    <Box
      p={{ _: '24px', md: '48px' }}
      overflowY="scroll"
      height="100%"
      width="100%"
    >
      <Box mb={3}>
        <ContactsViewMenuBar
          selectedContactSortOption={contactSortOption}
          onSelectedContactSortOptionChange={setContactSortOption}
          selectedViewMode={params.viewMode}
          selectedContactUsernameOrId={params.usernameOrId}
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
      {params.viewMode === 'glance' || params.viewMode === 'detail' ? (
        {
          glance: (
            <ContactsGlanceView
              selectedContactSortOption={contactSortOption}
              contacts={data.contacts}
              searchQueryValue={contactSearchQuery}
            />
          ),
          detail: (
            <ContactsDetailView
              selectedContactSortOption={contactSortOption}
              selectedContactUsernameOrId={params.usernameOrId}
              contacts={data.contacts}
              searchQueryValue={contactSearchQuery}
            />
          ),
        }[params.viewMode]
      ) : rootRouteMatch ? (
        <Redirect to={`${rootRouteMatch.url}/glance`} />
      ) : null}
    </Box>
  )
}
