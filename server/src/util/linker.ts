import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet, User } from 'src/models'
import { Ref } from 'src/models/scalars'

export const ROUTE_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i

const linkSheetToCardVersion = async (
  sheet: DocumentType<Sheet>,
  cardVersion: DocumentType<CardVersion>
) => {
  sheet.cardVersion = cardVersion
  await sheet.save()

  for (const cardId of sheet.cards) {
    const currCard = await Card.mongo.findById(cardId[0])
    currCard.user = cardVersion.user
    await currCard.save()
  }
}

const getCardVersionFromShortId = async (shortId: string): Promise<DocumentType<CardVersion>> => {
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

export const getUserFromCardId = async (cardId: string): Promise<Ref<User>> => {
  const cardModel = await Card.mongo.findById(cardId)
  return cardModel.user
}

export const linkSheetToUser = async (
  routeStr: string,
  shortId: string
): Promise<{ userId: string; sheetId: string }> => {
  const { sheetId } = spliceRouteStr(routeStr)

  const cardVersion = await getCardVersionFromShortId(shortId)

  const sheet = await Sheet.mongo.findById(sheetId)

  await linkSheetToCardVersion(sheet, cardVersion)

  return { userId: cardVersion.user.toString(), sheetId: sheet.id }
}
