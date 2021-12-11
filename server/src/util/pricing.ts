import { isValidStateAbr, StateCode } from 'src/util/states'

// Sync with client/src/utils/pricing.ts
export const QUANTITY_TO_PRICE = {
  25: 4000,
  50: 7500,
  100: 12000,
} as const

export type CardQuantityOption = keyof typeof QUANTITY_TO_PRICE

export const isValidQuantity = (quantity: number): quantity is CardQuantityOption => {
  return Object.keys(QUANTITY_TO_PRICE).includes(String(quantity))
}

export const calculateEstimatedTaxes = (subtotal: number, state?: StateCode) => {
  // At current stage, we only need to collect sales tax from California residents
  // https://www.notion.so/nomus/Research-sales-tax-obligations-8b54707c20334fad83fb53b60d2c2f10
  if (state && state === 'CA') {
    return Math.round(subtotal * 0.085)
  }
  return 0
}

export const getCostSummary = (quantity: number, state?: string) => {
  if (quantity == null) {
    return null
  }

  if (!isValidQuantity(quantity)) {
    return null
  }

  const subtotal = quantity ? QUANTITY_TO_PRICE[quantity] : null
  if (subtotal == null) {
    return null
  }

  state = state?.toUpperCase()
  let estimatedTaxes = 0
  if (state && isValidStateAbr(state)) {
    estimatedTaxes = subtotal ? calculateEstimatedTaxes(subtotal, state) : null
    if (estimatedTaxes == null) {
      return null
    }
  }

  const shipping = 0
  const discount = 0

  return {
    subtotal,
    estimatedTaxes,
    shipping,
    discount,
    total: subtotal + (estimatedTaxes ?? 0) + shipping - (discount ?? 0),
  }
}
