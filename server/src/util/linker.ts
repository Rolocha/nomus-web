import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet, User } from 'src/models'
import { Ref } from 'src/models/scalars'
import { CardInteractionType, OrderState } from './enums'
import { Result } from './error'

export const SHEET_CARD_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i
export const CARDV_REGEX = /(cardv_[a-f0-9]{24})/i

// responsible for splicing the NFC string in a URL to Sheet Id and Card Id
const spliceNFCString = (
  nfcString: string
): Result<{ sheetId: string; cardId: string }, 'invalid-format'> => {
  const sheetCardMatch = nfcString.match(SHEET_CARD_REGEX)
  if (sheetCardMatch && sheetCardMatch.length === 3) {
    return Result.ok({ sheetId: sheetCardMatch[1], cardId: sheetCardMatch[2] })
  }

  return Result.fail('invalid-format')
}

// responsible for splicing QR string, getting the CardVersion Id
const spliceQRString = (qrString: string): Result<{ cardVersionId: string }, 'invalid-format'> => {
  const cardVersionMatch = qrString.match(CARDV_REGEX)
  if (cardVersionMatch && cardVersionMatch.length === 2) {
    return Result.ok({ cardVersionId: cardVersionMatch[1] })
  }

  return Result.fail('invalid-format')
}

// determines the right interaction string and parses the relevant data with interaction type
export const getCardDataForInteractionString = async (
  interactionString: string
): Promise<
  Result<
    {
      cardVersion: CardVersion
      card: Card | null
      interactionType: CardInteractionType
    },
    'invalid-card-id'
  >
> => {
  const nfcParseResult = spliceNFCString(interactionString)
  if (nfcParseResult.isSuccess) {
    const card = await Card.mongo.findById(nfcParseResult.value.cardId).populate('cardVersion')
    if (card == null) {
      return Result.fail('invalid-card-id')
    }
    return Result.ok({
      // (as CardVersion) is safe since we populate it on card above
      cardVersion: card.cardVersion as CardVersion,
      card,
      interactionType: CardInteractionType.Tap,
    })
  }

  const qrParseResult = spliceQRString(interactionString)
  if (qrParseResult.isSuccess) {
    const cardVersion = await CardVersion.mongo.findById(qrParseResult.value.cardVersionId)
    return Result.ok({
      cardVersion,
      // we don't know which `card` was used for QR interaction strings
      card: null,
      interactionType: CardInteractionType.QRCode,
    })
  }

  return Result.fail('invalid-card-id')
}

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

  const res = sheet.cards.map(async (cardId) => {
    const currCard = await Card.mongo.findById(cardId)
    currCard.user = order.user
    currCard.cardVersion = cardVersion
    return await currCard.save()
  })
  try {
    await Promise.all(res.concat(sheet.save()))
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
    { userId: Ref<User>; sheetId: string },
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
    order.state = OrderState.Created
    await order.save()
  }

  return Result.ok({
    userId: order.user,
    sheetId: sheet.id,
  })
}
