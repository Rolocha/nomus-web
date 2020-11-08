import { Contact } from 'src/types/contact'

export const createMockContact = (contact: Partial<Contact> = {}): Contact => {
  return {
    id: 'user_1234',
    username: 'ippudo',
    name: {
      first: 'Ippudo',
      middle: null,
      last: 'Ramen',
    },
    bio: 'sample bio',
    phoneNumber: '5551234567',
    email: 'someemail@emailserver.com',
    headline: 'chief mock contact',
    profilePicUrl: 'https://placehold.it/300x300',
    cardFrontImageUrl: 'https://placehold.it/500x300',
    cardBackImageUrl: 'https://placehold.it/500x300',
    vcfUrl: 'https://placehold.it/300x300',
    meetingPlace: 'Over there',
    meetingDate: '2020-10-26',
    notes: 'some notes here',
    tags: ['nomus', 'roolz'],
    connected: false,
    ...contact,
  }
}
