import { DocumentType } from '@typegoose/typegoose'
import { Card, CardVersion, Order, Sheet, User } from 'src/models'
import { Ref } from 'src/models/scalars'
import { Result } from './error'

export const ROUTE_REGEX = /(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})/i

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

const getCardVersionFromShortId = async (shortId: string): Promise<DocumentType<CardVersion>> => {
  const order = await Order.mongo.findOne({ shortId: shortId })
  return await CardVersion.mongo.findById(order.cardVersion)
}

export const spliceRouteStr = (
  routeStr: string
): Result<{ sheetId: string; cardId: string }, string> => {
  const res = routeStr.match(ROUTE_REGEX)

  if (res && res.length === 3 && res[0] === routeStr) {
    return Result.ok({ sheetId: res[1], cardId: res[2] })
  }

  return Result.fail(`Incorrectly formatted routeStr: ${routeStr}`)
}

export const getUserFromCardId = async (cardId: string): Promise<User> => {
  const cardModel = await Card.mongo.findById(cardId)
  return User.mongo.findById(cardModel.user)
}

export const linkSheetToUser = async (
  routeStr: string,
  shortId: string
): Promise<Result<{ userId: string; sheetId: string }, 'cv-not-found' | 'sheet-not-found'>> => {
  const { sheetId } = spliceRouteStr(routeStr).getValue()

  const cardVersion = await getCardVersionFromShortId(shortId)
  if (!cardVersion) {
    return Result.fail('cv-not-found')
  }

  const sheet = await Sheet.mongo.findById(sheetId)
  if (!sheet) {
    return Result.fail('sheet-not-found')
  }

  await linkSheetToCardVersion(sheet, cardVersion)

  return Result.ok({ userId: cardVersion.user.toString(), sheetId: sheet.id })
}
