// Keep in sync with client/src/utils/pricing.ts
export const QUANTITY_TO_PRICE = {
  25: 2999,
  50: 5499,
  100: 9999,
}

export const isValidQuantity = (quantity: number) => {
  return Object.keys(QUANTITY_TO_PRICE).includes(String(quantity))
}

export const calculateCost = (quantity: number): number | null => {
  return QUANTITY_TO_PRICE[quantity] || null
}
