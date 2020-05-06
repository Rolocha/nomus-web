import { ConnectionModel, Connection } from 'src/models/Connection'
import { User } from 'src/models/User'

export const createMockConnection = async (
  user_from: Partial<User>,
  user_to: Partial<User>,
  connectionOverride: Partial<Connection> = {}
) => {
  const newConnectionPayload: Partial<Connection> = {
    from: user_from._id,
    to: user_to._id,
    notes: 'Notes!',
    ...connectionOverride,
  }
  return await ConnectionModel.create(newConnectionPayload)
}
