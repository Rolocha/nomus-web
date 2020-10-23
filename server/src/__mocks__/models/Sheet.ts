import { Sheet } from 'src/models'
import { createMockCardVersion } from './CardVersion'
import { createMockUser } from './User'

export const createMockSheet = async (sheetOverride: Partial<Sheet> = {}) => {
  const mockUser = await createMockUser()
  // let cardArray: Card[] = []
  // for (let i = 0; i < 25; i++) {
  //   const card = await createMockCard({ user: mockUser._id })
  //   cardArray.push(card)
  // }
  const newSheetPayload: Partial<Sheet> = {
    cardVersion: await createMockCardVersion({ user: mockUser._id }),
    cards: [],
    ...sheetOverride,
  }

  return await Sheet.mongo.create(newSheetPayload)
}
