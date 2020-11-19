import { Contact } from 'src/types/contact'
import { formatName } from './name'

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
