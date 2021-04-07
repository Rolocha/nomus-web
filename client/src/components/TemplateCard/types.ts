import CardTemplate from 'src/templates/base'
import templateLibrary from 'src/templates'

export type TemplateID = keyof typeof templateLibrary

type extractGeneric<Type> = Type extends CardTemplate<infer X> ? X : never

export type TemplateOptionsType<T extends TemplateID> = extractGeneric<
  typeof templateLibrary[T]
>
