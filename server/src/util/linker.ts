import { Card, CardVersion, Sheet } from 'src/models'

export const linkSheetToCardVersion = async (sheet: Sheet, cardVersion: CardVersion) => {
  const currSheet = await Sheet.mongo.findById(sheet._id)
  currSheet.cardVersion = cardVersion
  currSheet.save()

  for (const cardId in sheet.cards) {
    const currCard = await Card.mongo.findById(cardId)
    currCard.user = cardVersion.user
    await currCard.save()
  }
}

export const getCardVersionFromShortId = async (shortId: string): Promise<CardVersion> => {}
