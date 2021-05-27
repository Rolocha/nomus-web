import KonaTall from 'src/templates/konatall'
import KonaWide from 'src/templates/konawide'
import Rolocha from 'src/templates/rolocha'
import Velia from 'src/templates/velia'
import Jim from 'src/templates/jim'
import Nicole from 'src/templates/nicole'

export const templateLibrary = {
  velia: Velia,
  rolocha: Rolocha,
  konawide: KonaWide,
  konatall: KonaTall,
  jim: Jim,
  nicole: Nicole,
} as const

export type TemplateID = keyof typeof templateLibrary

export const templateNames = Object.keys(
  templateLibrary,
) as (keyof typeof templateLibrary)[]

export default templateLibrary
