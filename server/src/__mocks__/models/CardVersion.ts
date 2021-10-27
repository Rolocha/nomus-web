import { CardVersionModel, CardVersion } from 'src/models/CardVersion'
import { createMockUser } from './User'

export const createMockCardVersion = async (override: Partial<CardVersion> = {}) => {
  const newUser = override.user ?? (await createMockUser()).id
  const newCardVersionPayload: Partial<CardVersion> = {
    frontImageUrl: 'http://via.placeholder.com/500x300',
    backImageUrl: 'http://via.placeholder.com/500x300',
    // You probably want to override `user` if you care about who
    // this card version belongs to
    user: newUser,
    ...override,
  }

  return await CardVersionModel.create(newCardVersionPayload)
}
