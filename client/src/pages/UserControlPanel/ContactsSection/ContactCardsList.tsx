import { css } from '@emotion/react'
import * as React from 'react'
import Box from 'src/components/Box'
import BusinessCardImage from 'src/components/BusinessCardImage'
import { InternalLink } from 'src/components/Link'
import ProfilePicture from 'src/components/ProfilePicture'
import * as Text from 'src/components/Text'
import { colors } from 'src/styles'
import { Contact } from 'src/types/contact'
import { getFormattedFullDate } from 'src/utils/date'
import { formatName } from 'src/utils/name'
import { ContactsSortOption } from './utils'

type SortDirection = 'normal' | 'reverse'

interface Props {
  selectedContactSortOption: ContactsSortOption
  selectedContact?: Contact | null
  contacts: Contact[]
  viewMode: 'grid' | 'linear'
}

const bp = 'md'
const POINTY_TAB_INDICATOR = css`
  &:after {
    content: ' ';
    display: block;
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: ${colors.gold};
  }
`

const ContactCardsList = ({
  selectedContactSortOption,
  contacts,
  selectedContact,
  viewMode,
}: Props) => {
  const hasAutoscrolledToContact = React.useRef(false)
  const contactListRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (selectedContact != null) {
      if (!hasAutoscrolledToContact.current) {
        const target = document.getElementById(
          `contact-${selectedContact.username}`,
        )
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        hasAutoscrolledToContact.current = true
      }
    }
  }, [contactListRef, contacts, selectedContact])

  const makeContactSortKey = (c: Contact) =>
    ({
      [ContactsSortOption.MeetingDateNewest]: c.meetingDate
        ? getFormattedFullDate(c.meetingDate)
        : 'zzzzzz',
      [ContactsSortOption.MeetingDateOldest]: c.meetingDate
        ? getFormattedFullDate(c.meetingDate)
        : 'zzzzzz',
      [ContactsSortOption.Alphabetical]: formatName(c.name),
      [ContactsSortOption.MeetingPlace]: c.meetingPlace ?? '',
    }[selectedContactSortOption])
  const groupedContacts = contacts.reduce<Record<string, Contact[]>>(
    (acc, contact) => {
      const groupKey = {
        [ContactsSortOption.MeetingDateNewest]: contact.meetingDate
          ? getFormattedFullDate(contact.meetingDate)
          : 'Unknown Date',
        [ContactsSortOption.MeetingDateOldest]: contact.meetingDate
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
    },
    {},
  )

  const sortByDirection: SortDirection = {
    [ContactsSortOption.Alphabetical]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingDateNewest]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingDateOldest]: 'reverse' as SortDirection,
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
    [ContactsSortOption.MeetingDateNewest]: 'normal' as SortDirection,
    [ContactsSortOption.MeetingDateOldest]: 'reverse' as SortDirection,
    [ContactsSortOption.MeetingPlace]: 'normal' as SortDirection,
  }[selectedContactSortOption]

  return (
    <Box
      // Required visible in linear mode to allow selected contact caret (>) to be visible
      overflowX={viewMode === 'grid' ? 'hidden' : 'visible'}
      ref={contactListRef}
      px={2}
    >
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
                pt={viewMode === 'grid' ? 2 : 1}
                pb={viewMode === 'grid' ? '24px' : 2}
                display="flex"
                flexDirection={
                  ({
                    grid: 'row',
                    linear: 'column',
                  } as const)[viewMode]
                }
                flexWrap={viewMode === 'grid' ? 'wrap' : 'nowrap'}
                overflowX={{
                  _: 'hidden',
                  // Required visible in linear mode to allow selected contact caret (>) to be visible
                  [bp]: viewMode === 'grid' ? 'auto' : 'visible',
                }}
                mx={{ _: 0, [bp]: -2 }}
              >
                {groupedContacts[groupKey].map((contact) => {
                  const isSelectedContact = contact.id === selectedContact?.id
                  return (
                    <Box
                      id={`contact-${contact.username ?? contact.id}`}
                      key={contact.id}
                      display="inline-block"
                      borderRadius={1}
                      position="relative"
                      overflowX="visible"
                      p={2}
                      css={
                        viewMode === 'linear' && isSelectedContact
                          ? POINTY_TAB_INDICATOR
                          : null
                      }
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
                          width="100%"
                          boxShadow={viewMode === 'grid' ? 0 : undefined}
                        >
                          {
                            {
                              grid: (
                                <Box position="relative">
                                  <BusinessCardImage
                                    frontImageUrl={
                                      contact.cardFrontImageUrl ?? undefined
                                    }
                                    placeholder={!contact.cardFrontImageUrl}
                                    height="125px"
                                  />
                                  <Box
                                    position="absolute"
                                    bottom="-5px"
                                    right="-5px"
                                    width="40px"
                                  >
                                    <ProfilePicture
                                      name={contact.name}
                                      profilePicUrl={contact.profilePicUrl}
                                    />
                                  </Box>
                                </Box>
                              ),
                              linear: (
                                <Box width="40px">
                                  <ProfilePicture
                                    name={contact.name}
                                    profilePicUrl={contact.profilePicUrl}
                                  />
                                </Box>
                              ),
                            }[viewMode]
                          }
                          {viewMode === 'linear' && contact.name && (
                            <Box ml={2}>
                              <Text.Body3
                                fontWeight={isSelectedContact ? 500 : undefined}
                              >
                                {formatName(contact.name)}
                              </Text.Body3>
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
