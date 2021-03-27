export type TemplateID = 'velia'

export type BaseType = 'custom' | 'template'

export type CardBuilderStep =
  | 'base'
  | 'build'
  | 'review'
  | 'checkout'
  | 'complete'

export type OrderQuantityOption = 25 | 50 | 100

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
