import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet } from 'src/models'
import { OrderEventTrigger, OrderState } from './enums'
import { Result } from './error'
import { spliceNFCString } from './splicer'

// assigns fields on Sheet, CardVersion and Order
// goes through all Cards in the Sheet, assigning CardVersion and User
// helper function for linkSheetToUser
const linkSheetToOrder = async (
  sheet: DocumentType<Sheet>,
  order: DocumentType<Order>
): Promise<Result<undefined, 'cv-not-found' | 'save-error'>> => {
  const cardVersion = await CardVersion.mongo.findById(order.cardVersion)
  if (cardVersion == null) {
    return Result.fail('cv-not-found')
  }

  sheet.cardVersion = cardVersion.id
  sheet.order = order.id

  const sheetCardUpdatePromises = sheet.cards.map(async (cardId) => {
    const currCard = await Card.mongo.findById(cardId)
    currCard.user = order.user
    currCard.cardVersion = cardVersion
    return await currCard.save()
  })
  try {
    await Promise.all(sheetCardUpdatePromises.concat(sheet.save()))
    return Result.ok()
  } catch (e) {
    return Result.fail('save-error')
  }
}

// high-level function for Linker Resolver
// Assigns Sheet and Cards relevant field information
// Calculates job progress and transitions OrderState to Created
export const linkSheetToUser = async (
  nfcString: string,
  shortId: string
): Promise<
  Result<
    { userId: string; sheetId: string },
    'order-not-found' | 'cv-not-found' | 'sheet-not-found'
  >
> => {
  const { sheetId } = spliceNFCString(nfcString).getValue()

  const order = await Order.mongo.findOne({ shortId: shortId })
  if (order == null) {
    return Result.fail('order-not-found')
  }

  const sheet = await Sheet.mongo.findById(sheetId)
  if (!sheet) {
    return Result.fail('sheet-not-found')
  }

  await linkSheetToOrder(sheet, order)

  // Check if order has been completed before modifying state
  const sheetsPrintedSoFar = await Sheet.mongo.find({ order: order.id })
  const numCardsPrinted = sheetsPrintedSoFar.reduce((total, sheet) => total + sheet.cards.length, 0)
  if (numCardsPrinted === order.quantity) {
    await order.transition(OrderState.Created, OrderEventTrigger.Printer)
  }

  return Result.ok({
    userId: order.user.toString(),
    sheetId: sheet.id,
  })
}

export const unlinkSheet = async (
  sheetId: string
): Promise<Result<undefined, 'sheet-not-found' | 'save-error'>> => {
  const sheet = await Sheet.mongo.findById(sheetId)
  if (!sheet) {
    return Result.fail('sheet-not-found')
  }

  sheet.cardVersion = null
  sheet.order = null

  const sheetCardUpdatePromises = sheet.cards.map(async (cardId) => {
    const currCard = await Card.mongo.findById(cardId)
    currCard.user = null
    currCard.cardVersion = null
    return await currCard.save()
  })
  try {
    await Promise.all(sheetCardUpdatePromises.concat(sheet.save()))
    return Result.ok()
  } catch (e) {
    return Result.fail('save-error')
  }
}
