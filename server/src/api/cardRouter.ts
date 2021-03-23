import express from 'express'
import { authMiddleware } from 'src/auth'
import { CardInteraction } from 'src/models'
import { CardInteractionType } from 'src/util/enums'
import { getCardDataForInteractionString } from 'src/util/linker'

export const cardRouter = express.Router()

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
        message: `Got a non-tap (${interactionType}) interaction for a card without an associated user`,
      })
    }
  }
)
