import { TemplateID } from 'src/templates'

export type { TemplateID }

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
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
}

export type ComplexCondition = boolean | (() => boolean) | null

// A list of Card Builder fields that could cause errors that are only
// detectable after submission.
export type CardBuilderSubmissionErrorField = 'cardDetails'

export interface CardBuilderSubmissionError {
  message: string
  field?: CardBuilderSubmissionErrorField
  backlinkToStep?: CardBuilderStep
}
