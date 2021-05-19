import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'
// import Rolocha from 'src/templates/rolocha'
import Velia from 'src/templates/velia'

export const templateLibrary = {
  velia: Velia,
  // rolocha: Rolocha,
} as const

export type TemplateID = keyof typeof templateLibrary

type extractGeneric<Type> = Type extends CardTemplate<infer X, infer Y>
  ? CardTemplateRenderOptions<X, Y>
  : never

export type TemplateOptionsType<T extends TemplateID> = extractGeneric<
  typeof templateLibrary[T]
>

export const templateNames = Object.keys(
  templateLibrary,
) as (keyof typeof templateLibrary)[]

export default templateLibrary
