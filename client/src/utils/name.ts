interface IName {
  first: string
  middle?: string | null
  last: string
}

export const formatName = (name: IName) =>
  [name.first, name.middle, name.last].filter(Boolean).join(' ')
