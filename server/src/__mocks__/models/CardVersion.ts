import MUUID from 'uuid-mongodb'

import { CardVersionModel, CardVersion } from 'src/models/CardVersion'

export const createMockCardVersion = async (override: Partial<CardVersion> = {}) => {
  const newCardVersionPayload: Partial<CardVersion> = {
    name: {
      first: 'John',
      middle: 'Quincy',
      last: 'Adams',
    },
    imageUrl: 'http://via.placeholder.com/500x300',
    vcfUrl: 'http://some.link.to.a.vcf.file',
    // You probably want to override `user` if you care about who
    // this card version belongs to
    user: MUUID.v4(),
    ...override,
  }

  return await CardVersionModel.create(newCardVersionPayload)
}
