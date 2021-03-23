import { Card, CardVersion, User } from 'src/models'
import { CardInteractionType } from './enums'
import { Result } from './error'
import { spliceNFCString, spliceCardVersionString, spliceUserString } from './splicer'

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

  const qrParseResult = spliceCardVersionString(interactionString)
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
