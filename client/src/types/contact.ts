export interface PersonName {
  first: string
  middle?: string
  last: string
}

export interface Contact {
  //id of the user whose contact is being queried
  id: string
  username?: string
  name: PersonName
  phoneNumber?: string
  email?: string
  headline?: string
  bio?: string
  profilePicUrl?: string
  //unique to the connections, notes taken by the user querying
  cardFrontImageUrl?: string
  cardBackImageUrl?: string
  vcfUrl?: string

  meetingPlace?: string
  meetingDate?: Date
  notes?: string
}
