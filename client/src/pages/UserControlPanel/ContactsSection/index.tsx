import * as React from 'react'
import {
  Redirect,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom'
import { gql, useQuery } from 'src/apollo'
import { UCPContactsSectionQuery } from 'src/apollo/types/UCPContactsSectionQuery'
import Box from 'src/components/Box'
import LoadingPage from 'src/pages/LoadingPage'
import { filterContactListBySearchQuery } from 'src/utils/contacts'
import ContactsDetailView from './ContactsDetailView'
import ContactsSemptyState from './ContactsEmptyState'
import ContactsGlanceView from './ContactsGlanceView'
import ContactsViewMenuBar from './ContactsViewMenuBar'
import { ContactsSortOption } from './utils'

interface ParamsType {
  viewMode?: string
  username?: string
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

  let { loading, data } = useQuery<UCPContactsSectionQuery>(
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

  const searchFilteredContacts = filterContactListBySearchQuery(
    data.contacts,
    contactSearchQuery,
  )

  const selectedContact =
    params.username != null
      ? data.contacts.find(
          (user) =>
            user.username === params.username || user.id === params.username,
        ) ?? null
      : null

  const fallbackRedirect = <Redirect to="/dashboard/contacts/glance" />

  return (
    <Box
      p={{ _: '24px', md: '48px' }}
      overflowY="scroll"
      height="100%"
      width="100%"
    >
      <Box mb={3} position="relative" zIndex={1}>
        <ContactsViewMenuBar
          selectedContactSortOption={contactSortOption}
          onSelectedContactSortOptionChange={setContactSortOption}
          selectedViewMode={params.viewMode}
          selectedContact={selectedContact}
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

      <Box position="relative" zIndex={0}>
        {/* If URL is just /dashboard/contacts */}
        {rootRouteMatch && fallbackRedirect}
        {/* If URL is /dashboard/contacts/glance/:username (there's no way to view a specific user in glance view) */}
        {params.viewMode === 'glance' && params.username && fallbackRedirect}
        {/* If a username was provided in URL but there's no contact matching it */}
        {params.username && selectedContact == null && fallbackRedirect}

        {params.viewMode === 'glance' || params.viewMode === 'detail'
          ? {
              glance: (
                <ContactsGlanceView
                  selectedContactSortOption={contactSortOption}
                  contacts={searchFilteredContacts}
                />
              ),
              detail: (
                <ContactsDetailView
                  selectedContactSortOption={contactSortOption}
                  selectedContact={selectedContact}
                  contacts={searchFilteredContacts}
                />
              ),
            }[params.viewMode]
          : fallbackRedirect}
      </Box>
    </Box>
  )
}
