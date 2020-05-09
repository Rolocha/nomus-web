import { ConnectionModel, Connection } from 'src/models/Connection'
import { createMockUser } from './User'

export const createMockConnection = async (connectionOverride: Partial<Connection> = {}) => {
  const from = connectionOverride.from ?? (await createMockUser())
  const to = connectionOverride.to ?? (await createMockUser())
  const newConnectionPayload: Partial<Connection> = {
    ...connectionOverride,
    from,
    to,
  }
  return await ConnectionModel.create(newConnectionPayload)
}
