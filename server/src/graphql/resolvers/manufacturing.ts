import { DocumentType } from '@typegoose/typegoose'
import { Resolver, Authorized, Mutation, Arg, ObjectType, Field } from 'type-graphql'
import { Role } from 'src/util/enums'
import { Sheet, Card } from 'src/models'
import { createArrayCsvWriter } from 'csv-writer'
import { getObjectUrl, S3AssetCategory, uploadFileToS3 } from 'src/util/s3'
import { doNTimes } from 'src/util/array'

@ObjectType()
class MassEncoding {
  @Field()
  batchCsvUrl: string
}

const NUM_CARDS_IN_SHEET = 25

@Resolver()
class ManufacturingResolver {
  @Authorized(Role.Admin)
  @Mutation(() => MassEncoding, {
    description:
      'Takes in a number of sheets, creates the sheets and cards in the DB, and returns a CSV for the batch that we can share with production suppliers',
  })
  async createSheetBatch(
    @Arg('numSheets', { nullable: false }) numSheets: number
  ): Promise<MassEncoding> {
    // Create {numSheets} many Sheet objects
    const sheets: DocumentType<Sheet>[] = doNTimes(numSheets, () => new Sheet.mongo())

    // Keep a list of documents we need to call .save() on before we're done
    // We'll do it all at once to be more efficient
    const documentsToSave: DocumentType<any>[] = [...sheets]

    sheets.forEach((sheet) => {
      // Create `NUM_CARDS_IN_SHEET` cards for each sheet
      const cardsInSheet: DocumentType<Card>[] = doNTimes(NUM_CARDS_IN_SHEET, () => {
        const card = new Card.mongo()
        card.nfcId = `${sheet.id}-${card.id}`
        return card
      })
      sheet.cards = cardsInSheet
      documentsToSave.push(...cardsInSheet)
    })

    const batchCsvUrl = await this.createSheetBatchCsv(sheets)

    // Save the batch CSV URL to each sheet
    sheets.forEach((sheet) => {
      sheet.batchCsv = batchCsvUrl
    })

    // All done, save all the documents!
    await Promise.all(documentsToSave.map((document) => document.save()))

    return { batchCsvUrl }
  }

  // Takes a list of Sheet objects and returns a URL pointing to a CSV
  // with output format:
  //    url,sheet-number
  //    https://nomus.me/d/sheet_foo-card_bar,1
  //    ...more such lines
  private async createSheetBatchCsv(sheets: DocumentType<Sheet>[]): Promise<string> {
    const urlRecords: Array<Array<string>> = sheets.flatMap((sheet, sheetIndex) =>
      (sheet.cards as Card[]).map((card) => [card.nfcId, String(sheetIndex + 1)])
    )
    const filename = `nomus_sheet_encoding_${new Date().toISOString()}.csv`
    const filepath = `/tmp/${filename}`
    const csvWriter = createArrayCsvWriter({
      header: ['url', 'sheet-number'],
      path: filepath,
    })
    await csvWriter.writeRecords(urlRecords)

    const result = await uploadFileToS3(filepath, filename, S3AssetCategory.EncodingCSV)
    if (!result.isSuccess) {
      throw new Error(`Failed to upload to S3: ${result.error}`)
    }
    const s3Url = getObjectUrl(result.value)
    return s3Url
  }
}
export default ManufacturingResolver
