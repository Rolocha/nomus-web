import { TemplateID } from 'src/templates'

export type { TemplateID }

export enum BaseType {
  Custom = 'Custom',
  Template = 'Template',
}

export type CardBuilderStep =
  | 'base'
  | 'build'
  | 'review'
  | 'checkout'
  | 'complete'

export type OrderQuantityOption = 25 | 100 | 250

// Data from the order details form
export interface CheckoutFormData {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
}

export type ComplexCondition = boolean | (() => boolean) | null
