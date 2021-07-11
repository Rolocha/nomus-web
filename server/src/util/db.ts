import { mongoose } from '@typegoose/typegoose'

export async function performTransaction<T>(transactionCallback: () => Promise<T>): Promise<T> {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const transactionResult = await transactionCallback()
    await session.commitTransaction()
    return transactionResult
  } catch (err) {
    await session.abortTransaction()
    throw new Error(err)
  } finally {
    session.endSession()
  }
}
