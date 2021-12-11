import { PersonName } from 'src/models/subschemas'

export const formatName = (name: PersonName) =>
  [name.first, name.middle, name.last].filter(Boolean).join(' ')
