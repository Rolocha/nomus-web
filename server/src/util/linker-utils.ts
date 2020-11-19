import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet } from 'src/models'

const ROUTE_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i

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

export const getCardVersionFromShortId = async (
  shortId: string
): Promise<DocumentType<CardVersion>> => {
  const order = await Order.mongo.findOne({ shortId: shortId })
  return await CardVersion.mongo.findById(order.cardVersion)
}

export const spliceRouteStr = (routeStr: string): { sheetId: string; cardId: string } => {
  const res = routeStr.match(ROUTE_REGEX)

  if (res && res.length === 3 && res[0] === routeStr) {
    return { sheetId: res[1], cardId: res[2] }
  }

  throw new Error(`Incorrectly formatted routeStr: ${routeStr}`)
}

export const getUserFromCard = async (cardId: string) => {}
