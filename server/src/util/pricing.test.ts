import { calculateEstimatedTaxes, getCostSummary, QUANTITY_TO_PRICE } from 'src/util/pricing'

describe('pricing', () => {
  describe('calculate estimated taxes', () => {
    it('calculates no tax for non-california', async () => {
      expect(calculateEstimatedTaxes(QUANTITY_TO_PRICE[25], 'WI')).toBe(0)
      expect(calculateEstimatedTaxes(QUANTITY_TO_PRICE[25])).toBe(0)
    })
    it('calculates tax for california', async () => {
      expect(calculateEstimatedTaxes(QUANTITY_TO_PRICE[25], 'CA')).toBe(
        Math.round(QUANTITY_TO_PRICE[25] * 0.085)
      )
      expect(calculateEstimatedTaxes(QUANTITY_TO_PRICE[25], 'California')).toBe(
        Math.round(2999 * 0.085)
      )
    })
  })
  describe('getCostSummary', () => {
    it('returns null if incorrect', async () => {
      expect(getCostSummary(null)).toBe(null)
      expect(getCostSummary(1000)).toBe(null)
    })
    it('returns a price object if successful', async () => {
      expect(getCostSummary(25)).toMatchObject({
        subtotal: QUANTITY_TO_PRICE[25],
        estimatedTaxes: 0,
        shipping: 500,
        total: QUANTITY_TO_PRICE[25] + 0 + 500,
      })
      expect(getCostSummary(25, 'CA')).toMatchObject({
        subtotal: QUANTITY_TO_PRICE[25],
        estimatedTaxes: Math.round(QUANTITY_TO_PRICE[25] * 0.085),
        shipping: 500,
        total: QUANTITY_TO_PRICE[25] + Math.round(QUANTITY_TO_PRICE[25] * 0.085) + 500,
      })
    })
  })
})
