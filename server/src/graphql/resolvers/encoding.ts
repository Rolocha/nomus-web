import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'
import { createArrayCsvWriter } from 'csv-writer'

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
    const execution_date = new Date()
    const filename = `sheet_encoding_${execution_date.getFullYear()}-${
      execution_date.getMonth() + 1
    }-${execution_date.getDate()}.csv`
    let url_records = []

    for (let i = 0; i < numSheets; i++) {
      let sheet = await Sheet.mongo.create({
        cards: [],
      })
      let card_urls = []
      for (let i = 0; i < NUM_CARDS_IN_SHEET; i++) {
        let curr_card = await Card.mongo.create({})
        const stored_url = sheet.id + '-' + curr_card.id
        const nfc_url = 'https://nomus.me/d/' + stored_url
        card_urls.push(nfc_url)
        curr_card.nfcUrl = stored_url
        sheet.cards.push(curr_card._id)
        await curr_card.save()
        await sheet.save()
      }
      url_records.push(card_urls)
    }

    const csvWriter = createArrayCsvWriter({
      path: `/tmp/${filename}`,
    })
    await csvWriter.writeRecords(url_records)

    return { s3_url: 's3 url' }
  }
}
export default EncodingResolver
