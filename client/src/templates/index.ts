import Velia from 'src/templates/velia'

export const templateLibrary = {
  velia: Velia,
} as const

export const templateNames = Object.keys(
  templateLibrary,
) as (keyof typeof templateLibrary)[]

export default templateLibrary
