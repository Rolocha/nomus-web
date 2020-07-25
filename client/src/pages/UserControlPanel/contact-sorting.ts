export enum ContactsSortOption {
  Alphabetical = 'Alphabetical',
  MeetingDateNewest = 'Meeting date (newest)',
  MeetingDateOldest = 'Meeting date (oldest)',
  MeetingPlace = 'Meeting place',
}

export const allContactsSortOptions = [
  ContactsSortOption.Alphabetical,
  ContactsSortOption.MeetingDateNewest,
  ContactsSortOption.MeetingDateOldest,
  ContactsSortOption.MeetingPlace,
]
