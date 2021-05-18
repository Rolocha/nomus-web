// Sync with client/src/utils/pricing.ts
export const QUANTITY_TO_PRICE = {
  25: 2999,
  50: 5499,
  100: 9999,
}

export const isValidQuantity = (quantity: number) => {
  return Object.keys(QUANTITY_TO_PRICE).includes(String(quantity))
}

export const calculateEstimatedTaxes = (subtotal: number, state?: string) => {
  // TODO: Figure out how to actually estimate taxes based on user's zip
  if (state && (state.toUpperCase() === 'CA' || state.toUpperCase() === 'CALIFORNIA')) {
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

  const estimatedTaxes = subtotal ? calculateEstimatedTaxes(subtotal, state) : null
  if (estimatedTaxes == null) {
    return null
  }

  const shipping = 500

  return {
    subtotal,
    estimatedTaxes,
    shipping,
    total: subtotal + estimatedTaxes + shipping,
  }
}
