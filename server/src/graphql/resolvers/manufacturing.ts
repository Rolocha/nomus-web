import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'
import { createArrayCsvWriter } from 'csv-writer'
import { S3AssetCategory, uploadFileToS3 } from 'src/util/s3'

@ObjectType()
class MassEncoding {
  @Field()
  s3Url: string
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
    const urlRecords = []

    for (let i = 0; i < numSheets; i++) {
      // creates the sheet so the cards below can link to it
      let sheet = await Sheet.mongo.create({
        cards: [],
      })
      for (let j = 0; j < NUM_CARDS_IN_SHEET; j++) {
        //each sheet has 25 cards on it, so it will make a card then create it's url and store it on the card
        let currCard = await Card.mongo.create({})
        const storedId = `${sheet.id}-${currCard.id}`
        const nfcUrl = 'https://nomus.me/d/' + storedId

        //adds the url to the list of urls generated so far so to output the csv
        urlRecords.push([nfcUrl, i + 1])
        //assigns the url to the nfcUrl
        currCard.nfcId = storedId
        //links the card to its parent sheet
        sheet.cards.push(currCard._id)
        //saves in the database
        await currCard.save()
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
    await csvWriter.writeRecords(urlRecords)

    const result = await uploadFileToS3(filepath, filename, S3AssetCategory.EncodingCSV)
    if (!result.isSuccess) {
      throw new Error(`Failed to upload to S3: ${result.error}`)
    }

    return { s3Url: result.getValue() }
  }
}
export default ManufacturingResolver
