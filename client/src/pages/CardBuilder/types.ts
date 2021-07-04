export type CardBuilderStep =
  | 'base'
  | 'build'
  | 'review'
  | 'checkout'
  | 'complete'

export type OrderQuantityOption = 25 | 100 | 250

export type ComplexCondition = boolean | (() => boolean) | null

// A list of Card Builder fields that could cause errors that are only
// detectable after submission.
export type CardBuilderSubmissionErrorField = 'cardDetails'

export interface CardBuilderSubmissionError {
  message: string
  field?: CardBuilderSubmissionErrorField
  backlinkToStep?: CardBuilderStep
}
