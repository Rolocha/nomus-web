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
class ManufacturingResolver {
  @Authorized(Role.Admin)
  @Mutation(() => MassEncoding, {
    description:
      'Takes in a number of sheets, creates the sheets and cards in the DB, and uploads a CSV containing the info to S3',
  })
  async createMassSheetEncoding(
    @Arg('numSheets', { nullable: false }) numSheets: Number
  ): Promise<MassEncoding> {
    const executionDate = new Date()
    const filename = `nomus_sheet_encoding_${executionDate.toISOString().substr(0, 10)}.csv`
    const url_records = []

    for (let i = 0; i < numSheets; i++) {
      // creates the sheet so the cards below can link to it
      let sheet = await Sheet.mongo.create({
        cards: [],
      })
      for (let j = 0; j < NUM_CARDS_IN_SHEET; j++) {
        //each sheet has 25 cards on it, so it will make a card then create it's url and store it on the card
        let curr_card = await Card.mongo.create({})
        const stored_url = `${sheet.id}-${curr_card.id}`
        const nfc_url = 'https://nomus.me/d/' + stored_url

        //adds the url to the list of urls generated so far so to output the csv
        url_records.push([nfc_url, i + 1])
        //assigns the url to the nfcUrl
        curr_card.nfcUrl = stored_url
        //links the card to its parent sheet
        sheet.cards.push(curr_card._id)
        //saves in the database
        await curr_card.save()
        await sheet.save()
      }
    }

    const filepath = `/tmp/${filename}`
    const csvWriter = createArrayCsvWriter({
      header: ['url', 'sheet-number'],
      path: filepath,
    })
    //create the csv
    //Expected output:
    //url, sheet-number
    //https://nomus.me/d/<sheet-id>-<card-id>, sheet#
    //...
    await csvWriter.writeRecords(url_records)

    const result = await uploadEncodingCSV(filepath, filename)
    if (!result.isSuccess) {
      throw new Error(`Failed to upload to S3: ${result.error}`)
    }

    return { s3_url: result.getValue() }
  }
}
export default ManufacturingResolver
