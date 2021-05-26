import Kona from 'src/templates/kona'
import Rolocha from 'src/templates/rolocha'
import Velia from 'src/templates/velia'

export const templateLibrary = {
  velia: Velia,
  rolocha: Rolocha,
  kona: Kona,
} as const

export type TemplateID = keyof typeof templateLibrary

export const templateNames = Object.keys(
  templateLibrary,
) as (keyof typeof templateLibrary)[]

export default templateLibrary
