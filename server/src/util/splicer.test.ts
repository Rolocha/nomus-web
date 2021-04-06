import { spliceCardVersionString, spliceNFCString, spliceUserString } from './splicer'

describe('spliceNFCString', () => {
  it('successfully splices an NFC string', async () => {
    const response = spliceNFCString('sheet_5f9caf5ec9b90b8674941cc5-card_5f9caf5ec9b90b8674941ccd')
    expect(response.isSuccess).toBeTruthy()
  })
  it('successfully splices an NFC string (capitalized)', async () => {
    const response = spliceNFCString('sheet_5F9CAF5EC9B90B8674941CC5-card_5F9CAF5EC9B90B8674941CCD')
    expect(response.isSuccess).toBeTruthy()
  })
  it('fails if string is malformed (too short)', async () => {
    const response = spliceNFCString('sheet_5f9caf5ec9b90b8674941cc5-card_5f9caf5ec9b90b8674941cc')
    expect(response.isSuccess).toBeFalsy()

    const response2 = spliceNFCString('sheet_5f9caf5ec9b90b8674941cc-card_5f9caf5ec9b90b8674941ccd')
    expect(response2.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (too long)', async () => {
    const response = spliceNFCString(
      'sheet_5f9caf5ec9b90b8674941cc5-card_5f9caf5ec9b90b8674941ccd1'
    )
    expect(response.isSuccess).toBeFalsy()

    const response2 = spliceNFCString(
      'sheet_5f9caf5ec9b90b8674941cc51-card_5f9caf5ec9b90b8674941ccd'
    )
    expect(response2.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (improper characters)', async () => {
    const response = spliceNFCString(
      'sheet_5f9caf5ec9b90b8674!41cc5-card_5f9caf5ec9b90b8674941ccd1'
    )
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (repeating)', async () => {
    const response = spliceNFCString(
      'sheet_5f9caf5ec9b90b867441cc5-card_5f9caf5ec9b90b8674941ccd1-sheet_5f9caf5ec9b90b867441cc5-card_5f9caf5ec9b90b8674941ccd1'
    )
    expect(response.isSuccess).toBeFalsy()
  })
})

describe('spliceCardVersionString', () => {
  it('successfully splices a CardVersion string', async () => {
    const response = spliceCardVersionString('cardv_5f8377f85423e81574283c31')
    expect(response.isSuccess).toBeTruthy()
  })
  it('successfully splices a CardVersion string (capitalized)', async () => {
    const response = spliceCardVersionString('cardv_5F8377F85423E81574283C31')
    expect(response.isSuccess).toBeTruthy()
  })
  it('fails if string is malformed (too short)', async () => {
    const response = spliceCardVersionString('cardv_5f8377f85423e81574283c3')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (too long)', async () => {
    const response = spliceCardVersionString('cardv_5f8377f85423e81574283c312')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (improper characters)', async () => {
    const response = spliceCardVersionString('cardv_5f!377f85423e81574283c31')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (repeating)', async () => {
    const response = spliceCardVersionString(
      'cardv_5f8377f85423e81574283c31cardv_5f8377f85423e81574283c31'
    )
    expect(response.isSuccess).toBeFalsy()
  })
})

describe('spliceUserString', () => {
  it('successfully splices a User string', async () => {
    const response = spliceUserString('user_5f8377f85423e81574283c31')
    expect(response.isSuccess).toBeTruthy()
  })
  it('successfully splices a User string (capitalized)', async () => {
    const response = spliceUserString('user_5F8377F85423E81574283C31')
    expect(response.isSuccess).toBeTruthy()
  })
  it('fails if string is malformed (too short)', async () => {
    const response = spliceUserString('user_5f8377f85423e81574283c3')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (too long)', async () => {
    const response = spliceUserString('user_5f8377f85423e81574283c312')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (improper characters)', async () => {
    const response = spliceUserString('user_5f!377f85423e81574283c31')
    expect(response.isSuccess).toBeFalsy()
  })
  it('fails if string is malformed (repeating)', async () => {
    const response = spliceUserString('user_5f8377f85423e81574283c31user_5f8377f85423e81574283c31')
    expect(response.isSuccess).toBeFalsy()
  })
})
