import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'
import { createArrayCsvWriter } from 'csv-writer'
import { uploadEncodingCSV } from 'src/util/s3'

@ObjectType()
class MassEncoding {
  @Field()
  s3_url: string
}

const NUM_CARDS_IN_SHEET = 25

@Resolver()
class EncodingResolver {
  @Authorized(Role.Admin)
  @Mutation(() => MassEncoding)
  async createMassSheetEncoding(
    @Arg('numSheets', { nullable: false }) numSheets: Number
  ): Promise<MassEncoding> {
    const executionDate = new Date()
    const filename = `nomus_sheet_encoding_${executionDate.getFullYear()}-${
      executionDate.getMonth() + 1
    }-${executionDate.getDate()}.csv`
    let url_records = []

    for (let i = 0; i < numSheets; i++) {
      let sheet = await Sheet.mongo.create({
        cards: [],
      })
      for (let j = 0; j < NUM_CARDS_IN_SHEET; j++) {
        let curr_card = await Card.mongo.create({})
        const stored_url = sheet.id + '-' + curr_card.id
        const nfc_url = 'https://nomus.me/d/' + stored_url
        url_records.push([nfc_url, i + 1])
        curr_card.nfcUrl = stored_url
        sheet.cards.push(curr_card._id)
        await curr_card.save()
        await sheet.save()
      }
    }

    const filepath = `/tmp/${filename}`
    const csvWriter = createArrayCsvWriter({
      header: ['url', 'sheet-number'],
      path: filepath,
    })
    await csvWriter.writeRecords(url_records)

    const result = await uploadEncodingCSV(filepath, filename)
    if (!result.isSuccess) {
      throw new Error(`Failed to upload to S3: ${result.error}`)
    }

    return { s3_url: result.getValue() }
  }
}
export default EncodingResolver
