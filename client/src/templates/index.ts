import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'
import Velia from 'src/templates/velia'

export const templateLibrary = {
  velia: Velia,
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
