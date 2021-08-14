import { Contact } from 'src/types/contact'
import { formatName } from 'src/utils/name'

export enum ContactsSortOption {
  Alphabetical = 'Alphabetical',
  Company = 'Company',
  MeetingDateNewest = 'Meeting date (newest)',
  MeetingDateOldest = 'Meeting date (oldest)',
  MeetingPlace = 'Meeting place',
}

export const allContactsSortOptions = [
  ContactsSortOption.Alphabetical,
  ContactsSortOption.Company,
  ContactsSortOption.MeetingDateNewest,
  ContactsSortOption.MeetingDateOldest,
  ContactsSortOption.MeetingPlace,
]

export const filterContactListBySearchQuery = (
  contactList: Contact[],
  searchQuery: string,
): Contact[] => {
  return contactList.filter(
    (contact) =>
      formatName(contact.name)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (contact.username &&
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())),
  )
}
