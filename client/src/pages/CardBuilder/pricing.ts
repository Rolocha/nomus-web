// Sync with server/src/util/pricing.ts
export const QUANTITY_TO_PRICE = {
  25: 2999,
  50: 5499,
  100: 9999,
}

export const calculateEstimatedTaxes = (subtotal: number) => {
  // TODO: Figure out how to actually estimate taxes based on user's zip
  return Math.round(subtotal * 0.095)
}

export const getCostSummary = (
  quantity: keyof typeof QUANTITY_TO_PRICE | null,
) => {
  if (quantity == null) {
    return null
  }

  const subtotal = quantity ? QUANTITY_TO_PRICE[quantity] : null
  if (subtotal == null) {
    return null
  }

  const estimatedTaxes = subtotal ? calculateEstimatedTaxes(subtotal) : null
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
