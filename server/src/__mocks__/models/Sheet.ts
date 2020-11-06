import { Sheet } from 'src/models'
import { createMockCardVersion } from './CardVersion'
import { createMockUser } from './User'

export const createMockSheet = async (sheetOverride: Partial<Sheet> = {}) => {
  const mockUser = await createMockUser()

  const newSheetPayload: Partial<Sheet> = {
    cardVersion: await createMockCardVersion({ user: mockUser._id }),
    cards: [],
    ...sheetOverride,
  }

  return await Sheet.mongo.create(newSheetPayload)
}
