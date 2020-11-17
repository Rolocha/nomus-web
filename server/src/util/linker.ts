import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Sheet } from 'src/models'

export const linkSheetToCardVersion = async (
  sheet: DocumentType<Sheet>,
  cardVersion: DocumentType<CardVersion>
) => {
  sheet.cardVersion = cardVersion
  sheet.save()

  for (const cardId of sheet.cards) {
    const currCard = await Card.mongo.findById(cardId[0])
    currCard.user = cardVersion.user
    await currCard.save()
  }
}

// export const getCardVersionFromShortId = async (shortId: string): Promise<CardVersion> => {}
