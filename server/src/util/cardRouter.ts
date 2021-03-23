import { Card, CardVersion, User } from 'src/models'
import { CardInteractionType } from './enums'
import { Result } from './error'

export const SHEET_CARD_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i
export const CARDV_REGEX = /(cardv_[a-f0-9]{24})/i
export const USER_REGEX = /(user_[a-f0-9]{24})/i

// responsible for splicing the NFC string in a URL to Sheet Id and Card Id
export const spliceNFCString = (
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

// responsible for splicing QR string, getting the User Id
const spliceUserString = (userString: string): Result<{ userId: string }, 'invalid-format'> => {
  const userMatch = userString.match(USER_REGEX)
  if (userMatch && userMatch.length === 2) {
    return Result.ok({ userId: userMatch[1] })
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
      cardUser: User
    },
    'invalid-interaction-string' | 'invalid-card-id' | 'invalid-cardVersion-id' | 'invalid-user-id'
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
      cardUser: (await User.mongo.findById(card.user)) ?? null,
    })
  }

  const qrParseResult = spliceQRString(interactionString)
  if (qrParseResult.isSuccess) {
    const cardVersion = await CardVersion.mongo.findById(qrParseResult.value.cardVersionId)
    if (cardVersion == null) {
      return Result.fail('invalid-cardVersion-id')
    }
    return Result.ok({
      cardVersion,
      // we don't know which `card` was used for QR interaction strings
      card: null,
      interactionType: CardInteractionType.QRCode,
      cardUser: await User.mongo.findById(cardVersion.user),
    })
  }

  const userParseResult = spliceUserString(interactionString)
  if (userParseResult.isSuccess) {
    const cardUser = await User.mongo.findById(userParseResult.value.userId)
    if (cardUser == null) {
      return Result.fail('invalid-user-id')
    }
    const cardVersion = await CardVersion.mongo.findById(cardUser.defaultCardVersion)
    return Result.ok({
      cardVersion,
      // we don't know which `card` was used for QR interaction strings
      card: null,
      interactionType: CardInteractionType.QRCode,
      cardUser,
    })
  }

  return Result.fail('invalid-interaction-string')
}
