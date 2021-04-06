import { Result } from './error'

export const SHEET_CARD_REGEX = /^(sheet_[a-f0-9]{24})-(card_[a-f0-9]{24})$/i
export const CARDV_REGEX = /^(cardv_[a-f0-9]{24})$/i
export const USER_REGEX = /^(user_[a-f0-9]{24})$/i

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
export const spliceCardVersionString = (
  qrString: string
): Result<{ cardVersionId: string }, 'invalid-format'> => {
  const cardVersionMatch = qrString.match(CARDV_REGEX)
  if (cardVersionMatch && cardVersionMatch.length === 2) {
    return Result.ok({ cardVersionId: cardVersionMatch[1] })
  }

  return Result.fail('invalid-format')
}

// responsible for splicing QR string, getting the User Id
export const spliceUserString = (
  userString: string
): Result<{ userId: string }, 'invalid-format'> => {
  const userMatch = userString.match(USER_REGEX)
  if (userMatch && userMatch.length === 2) {
    return Result.ok({ userId: userMatch[1] })
  }

  return Result.fail('invalid-format')
}
