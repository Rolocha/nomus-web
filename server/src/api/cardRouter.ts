import express from 'express'
import { authMiddleware } from 'src/auth'
import { CardInteraction } from 'src/models'
import { CardInteractionType } from 'src/util/enums'
import { Card, CardVersion, User } from 'src/models'
import { Result } from 'src/util/error'

export const cardRouter = express.Router()

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

// interactionString should take one of the following formats based on InteractionType
//   - InteractionType.Tap (NFC): sheet_x_card_y
//   - InteractionType.QRCode   : cardv_z
//                              : user_a
cardRouter.get(
  '/:interactionString',
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    const { interactionString } = req.params

    const cardDataResult = await getCardDataForInteractionString(interactionString)
    if (!cardDataResult.isSuccess) {
      // Failed result indicates the URL parse failed
      res.status(404).json({
        message: cardDataResult.error.name,
      })
      return
    }

    const { cardVersion, card, interactionType, cardUser } = cardDataResult.value

    // Log an interaction with this card
    if (cardVersion) {
      await CardInteraction.mongo.create({
        card: card?.id, // may or may not be present
        cardVersion: cardVersion.id,
        interactionType,
      })
    }

    if (cardUser) {
      res.redirect(307, `/${cardUser.username}`)
    } else if (interactionType === CardInteractionType.Tap) {
      res.redirect(302, `/admin/linker/${interactionString}`)
    } else {
      res.status(400).json({
        // This should never happen
        message: `Got a non-tap (${interactionType}) interaction for a card without an associated user`,
      })
    }
  }
)
