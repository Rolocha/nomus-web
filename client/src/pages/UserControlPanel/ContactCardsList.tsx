import * as React from 'react'
import Box from 'src/components/Box'
import Image from 'src/components/Image'
import { InternalLink } from 'src/components/Link'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { getMonthString } from 'src/utils/date'
import { formatName } from 'src/utils/name'

interface Props {
  contacts: Contact[]
  searchQuery: string
  viewMode: 'grid' | 'linear'
  groupBy: 'meetingDate' | 'firstInitial' | 'lastInitial'
  sortGroupsDirection: 'normal' | 'reverse'
  sortBy: 'meetingDate' | 'fullName'
  sortByDirection: 'normal' | 'reverse'
}

const formatDate = (date: Date | number) => {
  const dateObj = new Date(date)
  return `${getMonthString(
    dateObj.getMonth(),
  )} ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}

const ContactCardsList = ({
  contacts,
  searchQuery,
  groupBy,
  sortGroupsDirection,
  sortBy,
  sortByDirection,
  viewMode,
}: Props) => {
  const makeContactSortKey = (c: Contact) =>
    ({
      meetingDate: c.meetingDate ? formatDate(c.meetingDate) : 'zzzzzz',
      fullName: formatName(c.name),
    }[sortBy])
  const groupedContacts = contacts
    .filter(
      (contact) =>
        formatName(contact.name).includes(searchQuery) ||
        contact.username.includes(searchQuery),
    )
    .reduce<Record<string, Contact[]>>((acc, contact) => {
      const groupKey = {
        meetingDate: contact.meetingDate
          ? formatDate(contact.meetingDate)
          : 'Unknown Date',
        firstInitial: contact.name.first[0],
        lastInitial: contact.name.last[0],
      }[groupBy]

      if (groupKey in acc) {
        acc[groupKey].push(contact)
      } else {
        acc[groupKey] = [contact]
      }
      return acc
    }, {})

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

  return (
    <Box>
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
                mx={-2}
              >
                {groupedContacts[groupKey].map((contact) => (
                  <Box
                    key={contact.id}
                    display="inline-block"
                    width={viewMode === 'grid' ? '25%' : '100%'}
                    p={2}
                  >
                    <InternalLink
                      to={`/dashboard/contacts/detail/${
                        contact.username ?? contact.id
                      }`}
                      noUnderline
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Image
                          src={contact.cardFrontImageUrl}
                          w={viewMode === 'grid' ? '100%' : '40px'}
                        />
                        {viewMode === 'linear' && contact.name && (
                          <Box ml={2}>
                            <Text.Body>{formatName(contact.name)}</Text.Body>
                          </Box>
                        )}
                      </Box>
                    </InternalLink>
                  </Box>
                ))}
              </Box>
            </Box>
          )
        })}
    </Box>
  )
}

export default ContactCardsList
