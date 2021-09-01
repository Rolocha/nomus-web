import express from 'express'
import { authMiddleware } from 'src/auth'
import { Card, CardInteraction, CardVersion, User } from 'src/models'
import { CardInteractionType } from 'src/util/enums'
import { Result } from 'src/util/error'
import { spliceCardVersionString, spliceNFCString, spliceUserString } from 'src/util/splicer'

export const cardRouter = express.Router()

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
    const cardVersion = await CardVersion.mongo
      .findById(qrParseResult.value.cardVersionId)
      .populate('user')
    if (cardVersion == null) {
      return Result.fail('invalid-cardVersion-id')
    }
    return Result.ok({
      cardVersion,
      // we don't know which `card` was used for QR interaction strings
      card: null,
      interactionType: CardInteractionType.QRCode,
      cardUser: cardVersion.user as User,
    })
  }

  const userParseResult = spliceUserString(interactionString)
  if (userParseResult.isSuccess) {
    const cardUser = await User.mongo
      .findById(userParseResult.value.userId)
      .populate('defaultCardVersion')
    if (cardUser == null) {
      return Result.fail('invalid-user-id')
    }
    const cardVersion = cardUser.defaultCardVersion as CardVersion
    return Result.ok({
      cardVersion,
      // we don't know which `card` was used for QR interaction strings
      // this gets hit if the QR code is encoded with a userId instead of cardVersionId
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
//   - InteractionType.QRCode   : user_a -> Debt, some QR codes in Alpha were printed with the userID
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
      const redirectUrl = await cardUser.getCardTapLink()
      res.redirect(307, redirectUrl)
    } else if (interactionType === CardInteractionType.Tap) {
      // When a card has yet to be linked, go here.
      // Most likely initiated by someone performing the linking process
      res.redirect(302, `/admin/linker/${interactionString}`)
    } else {
      res.status(400).json({
        // This should never happen
        message: `Got a non-tap (${interactionType}) interaction for a card without an associated user`,
      })
    }
  }
)
