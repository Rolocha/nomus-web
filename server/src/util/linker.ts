import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet } from 'src/models'
import { Ref } from 'src/models/scalars'
import { CardInteractionType } from './enums'
import { Result } from './error'

export const SHEET_CARD_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i
export const CARDV_REGEX = /(cardv_[a-f0-9]{24})/i

const linkSheetToCardVersion = async (
  sheet: DocumentType<Sheet>,
  cardVersion: DocumentType<CardVersion>
): Promise<Result<undefined, 'save-error'>> => {
  sheet.cardVersion = cardVersion
  const res = sheet.cards.map(async (cardId) => {
    const currCard = await Card.mongo.findById(cardId)
    currCard.user = cardVersion.user
    return await currCard.save()
  })
  try {
    await Promise.all(res.concat(sheet.save()))
    return Result.ok()
  } catch (e) {
    return Result.fail('save-error')
  }
}

const getCardVersionRefFromShortId = async (
  shortId: string
): Promise<Result<{ cardv: Ref<CardVersion> }, 'order-not-found'>> => {
  const order = await Order.mongo.findOne({ shortId: shortId })
  if (order == null) {
    return Result.fail('order-not-found')
  }
  return Result.ok({ cardv: order.cardVersion })
}

const spliceNFCString = (
  nfcString: string
): Result<{ sheetId: string; cardId: string }, 'invalid-format'> => {
  const sheetCardMatch = nfcString.match(SHEET_CARD_REGEX)
  if (sheetCardMatch && sheetCardMatch.length === 3) {
    return Result.ok({ sheetId: sheetCardMatch[1], cardId: sheetCardMatch[2] })
  }

  return Result.fail('invalid-format')
}

const spliceQRString = (qrString: string): Result<{ cardVersionId: string }, 'invalid-format'> => {
  const cardVersionMatch = qrString.match(CARDV_REGEX)
  if (cardVersionMatch && cardVersionMatch.length === 2) {
    return Result.ok({ cardVersionId: cardVersionMatch[1] })
  }

  return Result.fail('invalid-format')
}

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

export const linkSheetToUser = async (
  nfcString: string,
  shortId: string
): Promise<Result<{ userId: string; sheetId: string }, 'cv-not-found' | 'sheet-not-found'>> => {
  const { sheetId } = spliceNFCString(nfcString).getValue()

  const cardVersionResult = await getCardVersionRefFromShortId(shortId)
  if (!cardVersionResult.isSuccess) {
    return Result.fail('cv-not-found')
  }
  const cardVersion = await CardVersion.mongo.findById(cardVersionResult.getValue().cardv)

  const sheet = await Sheet.mongo.findById(sheetId)
  if (!sheet) {
    return Result.fail('sheet-not-found')
  }

  await linkSheetToCardVersion(sheet, cardVersion)

  return Result.ok({
    userId: cardVersion.user.toString(),
    sheetId: sheet.id,
  })
}
