export interface PersonName {
  first: string
  middle: string | null
  last: string
}

export interface Contact {
  //id of the user whose contact is being queried
  id: string
  username: string | null
  name: PersonName
  phoneNumber: string | null
  email: string | null
  headline: string | null
  bio: string | null
  profilePicUrl: string | null
  //unique to the connections, notes taken by the user querying
  cardFrontImageUrl: string | null
  cardBackImageUrl: string | null
  vcfUrl: string | null

  meetingPlace: string | null
  meetingDate: Date | null
  notes: string | null
}
