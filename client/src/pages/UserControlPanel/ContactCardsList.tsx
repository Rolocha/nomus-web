import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { InternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { getFormattedFullDate } from 'src/utils/date'
import { formatName } from 'src/utils/name'
import { ContactsSortOption } from './contact-sorting'

type SortDirection = 'normal' | 'reverse'

interface Props {
  selectedContactSortOption: ContactsSortOption
  selectedContactUsernameOrId?: string
  contacts: Contact[]
  searchQuery: string
  viewMode: 'grid' | 'linear'
}

const bp = 'md'

const ContactCardsList = ({
  selectedContactSortOption,
  contacts,
  selectedContactUsernameOrId,
  searchQuery,
  viewMode,
}: Props) => {
  const hasAutoscrolledToContact = React.useRef(false)
  const contactListRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (selectedContactUsernameOrId != null) {
      if (!hasAutoscrolledToContact.current) {
        const target = document.getElementById(
          `contact-${selectedContactUsernameOrId}`,
        )
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        hasAutoscrolledToContact.current = true
      }
    }
  }, [contactListRef, contacts, selectedContactUsernameOrId])

  const makeContactSortKey = (c: Contact) =>
    ({
      [ContactsSortOption.MeetingDate]: c.meetingDate
        ? getFormattedFullDate(c.meetingDate)
        : 'zzzzzz',
      [ContactsSortOption.Alphabetical]: formatName(c.name),
      [ContactsSortOption.MeetingPlace]: c.meetingPlace ?? '',
    }[selectedContactSortOption])
  const groupedContacts = contacts
    .filter(
      (contact) =>
        formatName(contact.name)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (contact.username &&
          contact.username.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .reduce<Record<string, Contact[]>>((acc, contact) => {
      const groupKey = {
        [ContactsSortOption.MeetingDate]: contact.meetingDate
          ? getFormattedFullDate(contact.meetingDate)
          : 'Unknown Date',
        [ContactsSortOption.Alphabetical]: contact.name.first[0],
        [ContactsSortOption.MeetingPlace]: contact.meetingPlace ?? '',
      }[selectedContactSortOption]

      if (groupKey in acc) {
        acc[groupKey].push(contact)
      } else {
        acc[groupKey] = [contact]
      }
      return acc
    }, {})

  const sortByDirection: SortDirection = {
    [ContactsSortOption.Alphabetical]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingDate]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingPlace]: 'normal' as SortDirection,
  }[selectedContactSortOption]

  // Sort (in-place) the grouped contacts based on sortBy and sortByDirection
  Object.keys(groupedContacts).forEach((groupKey) => {
    groupedContacts[groupKey].sort((a, b) => {
      const sortKeyA = makeContactSortKey(a)
      const sortKeyB = makeContactSortKey(b)
      return (
        (sortByDirection === 'reverse' ? -1 : 1) *
        (sortKeyA < sortKeyB ? -1 : 1)
      )
    })
  })

  const sortGroupsDirection: SortDirection = {
    [ContactsSortOption.Alphabetical]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingDate]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingPlace]: 'normal' as SortDirection,
  }[selectedContactSortOption]

  return (
    <Box overflowX="hidden" ref={contactListRef}>
      {Object.keys(groupedContacts)
        .sort((groupKeyA, groupKeyB) => {
          return (
            (sortGroupsDirection === 'reverse' ? -1 : 1) *
            (groupKeyA < groupKeyB ? -1 : 1)
          )
        })
        .map((groupKey) => {
          return (
            <Box key={groupKey}>
              <Box borderBottom={`1px solid ${colors.superlightGray}`}>
                <Text.Label>{groupKey}</Text.Label>
              </Box>
              <Box
                py={2}
                display="flex"
                flexDirection={
                  ({
                    grid: 'row',
                    linear: 'column',
                  } as const)[viewMode]
                }
                flexWrap={viewMode === 'grid' ? 'wrap' : 'nowrap'}
                overflowX={{ _: 'hidden', [bp]: 'auto' }}
                mx={{ _: -2, [bp]: 0 }}
              >
                {groupedContacts[groupKey].map((contact) => {
                  const isSelectedContact =
                    contact.username === selectedContactUsernameOrId ||
                    contact.id === selectedContactUsernameOrId
                  return (
                    <Box
                      id={`contact-${contact.username ?? contact.id}`}
                      key={contact.id}
                      display="inline-block"
                      width={
                        viewMode === 'grid' ? { _: '50%', [bp]: '25%' } : '100%'
                      }
                      borderRadius={1}
                      p={2}
                      bg={
                        viewMode === 'linear' && isSelectedContact
                          ? colors.gold
                          : undefined
                      }
                    >
                      <InternalLink
                        to={`/dashboard/contacts/detail/${
                          contact.username ?? contact.id
                        }`}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Image
                            src={contact.cardFrontImageUrl ?? undefined}
                            w={viewMode === 'grid' ? '100%' : '40px'}
                          />
                          {viewMode === 'linear' && contact.name && (
                            <Box ml={2}>
                              <Text.Body
                                fontWeight={isSelectedContact ? 500 : undefined}
                              >
                                {formatName(contact.name)}
                              </Text.Body>
                            </Box>
                          )}
                        </Box>
                      </InternalLink>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })}
    </Box>
  )
}

export default ContactCardsList
