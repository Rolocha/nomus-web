export interface IName {
  first: string
  middle?: string | null
  last: string
}

export const formatName = (name: IName) =>
  [name.first, name.middle, name.last].filter(Boolean).join(' ')

export const getInitials = (name: IName) => `${name.first[0]}${name.last[0]}`
