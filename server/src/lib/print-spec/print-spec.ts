import fs from 'fs'
import imageSize from 'image-size'
import os from 'os'
import path from 'path'
import PDFDocument from 'pdfkit'

const SHORT_ID_SIZE = 0.4

// Define core measurements in millimeters
const MEASUREMENTS_MM = {
  cardWidth: 93,
  cardHeight: 54,
  cardSheetWidth: 480,
  cardSheetHeight: 300,
  marginLeft: 7.5,
  marginTop: 15,
  cropmarkWidth: 4.1,
  cropmarkHeight: 3.2,
  bleedStrokeWidth: 0.1,
}

// In testing, keep resolution low to keep snapshot tests quick
// For real PDFs, we want 300 pixels/inch ÷ (1/25.4) inch/mm
const MM_TO_PX = process.env.NODE_ENV === 'test' ? 3 : 300 / 25.4

// Convert the MEASUREMENTS_MM object to an identically shaped one with pixel-based values
const MEASUREMENTS_PX = Object.keys(MEASUREMENTS_MM).reduce((acc, measurementKey) => {
  acc[measurementKey] = Math.round(MEASUREMENTS_MM[measurementKey] * MM_TO_PX)
  return acc
}, {}) as typeof MEASUREMENTS_MM

// Destructuring all the measurements for ease of use throughout this module
const {
  cardSheetWidth,
  cardSheetHeight,
  cardWidth,
  cardHeight,
  marginTop,
  marginLeft,
  cropmarkWidth,
  cropmarkHeight,
  bleedStrokeWidth,
} = MEASUREMENTS_PX

interface PrintImageArrayOptions {
  startX: number
  startY: number
  imageHeight: number
  imageWidth: number
  omitCropmarks?: boolean
}

type Orientation = 'vertical' | 'horizontal'

interface PrintSpecData {
  frontImageLocalFilePath: string
  backImageLocalFilePath?: string
  shortId: string
}

interface GeneratePDFOptions {
  numSheets: number
  filename?: string
  filepath?: string
}

export default class PrintSpec {
  data: PrintSpecData
  orientation: Orientation
  doc: typeof PDFDocument

  constructor(data: PrintSpecData) {
    this.data = data
    this.orientation = this.determineOrientation()
  }

  // Generates an on-disk PDF for the print spec and resolves with the filepath
  public async generatePDF(options: GeneratePDFOptions): Promise<string> {
    if (options.numSheets % 1 !== 0) {
      throw new Error('generatePDF received numSheets param that is not a whole number')
    }

    // For vertical cards, we need to rotate the document
    const docSize = {
      horizontal: [cardSheetWidth, cardSheetHeight],
      vertical: [cardSheetHeight, cardSheetWidth],
    }[this.orientation]

    this.doc = new PDFDocument({
      size: docSize,
    })

    const printSpecTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'print-specs'))

    if (options.filename && options.filepath) {
      console.warn(
        'generatePDF was given both a filename and filepath which is redundant! `filename` will be ignored.'
      )
    }

    const printSpecFileName = options.filename ?? `${this.data.shortId}-${Date.now()}.pdf`
    const printSpecFilePath = options.filepath ?? path.join(printSpecTmpDir, printSpecFileName)
    const writeStream = fs.createWriteStream(printSpecFilePath)
    this.doc.pipe(writeStream)

    const printImageArrayOrientationBasedOptions = {
      horizontal: {
        imageWidth: cardWidth,
        imageHeight: cardHeight,
        startX: marginLeft,
        startY: marginTop,
      },
      vertical: {
        imageWidth: cardHeight,
        imageHeight: cardWidth,
        startX: marginTop,
        startY: marginLeft,
      },
    } as Record<string, PrintImageArrayOptions>

    for (let i = 0; i < options.numSheets; i += 1) {
      // Don't create a new page on the first sheet since the doc instantation creates the first blank sheet
      if (i !== 0) {
        this.doc.addPage()
      }
      // Print the front side
      this.printShortId()
      this.printImageArray(this.data.frontImageLocalFilePath, {
        ...printImageArrayOrientationBasedOptions[this.orientation],
      })

      // Print the back side
      this.doc.addPage()
      this.printImageArray(this.data.backImageLocalFilePath, {
        ...printImageArrayOrientationBasedOptions[this.orientation],
      })
      this.printShortId()
    }

    const completionPromise = new Promise<void>((resolve) => {
      writeStream.addListener('finish', resolve)
    })
    this.doc.end()
    await completionPromise
    return printSpecFilePath
  }

  /** Private methods **/

  private determineOrientation(): Orientation {
    const frontDimensions = imageSize(this.data.frontImageLocalFilePath)
    const backDimensions = imageSize(this.data.backImageLocalFilePath)

    if (
      frontDimensions.height !== backDimensions.height ||
      frontDimensions.width !== backDimensions.width
    ) {
      throw new Error('Front and back images have mismatched dimensions!')
    }

    return frontDimensions.width > frontDimensions.height ? 'horizontal' : 'vertical'
  }

  private printShortId() {
    // Print the short IDs on the bottom
    const yEndOfCards = marginTop + cardHeight * 5
    const yEndOfDoc = cardSheetHeight
    const ySpaceForShortId = yEndOfDoc - yEndOfCards
    const shortIdFontSize = Math.round(ySpaceForShortId * SHORT_ID_SIZE)
    const yShortId = yEndOfCards + ySpaceForShortId / 2

    const textRenderOptions = {
      lineBreak: false,
      lineGap: 0,
      paragraphGap: 0,
      baseline: 'middle',
    } as const

    const shortIdWidth = this.doc
      .font('Courier')
      .fontSize(shortIdFontSize)
      .widthOfString(this.data.shortId, textRenderOptions)

    const xPositions = [
      marginLeft,
      (cardSheetWidth - shortIdWidth) / 2,
      cardSheetWidth - marginLeft - shortIdWidth,
    ]

    const isVertical = this.orientation === 'vertical'
    xPositions.forEach((xPos) => {
      // If we're drawing vertical cards, we need to "rotate the paper" by -90º
      // before we "write" the short ID down and we need to flip the x/y positions
      if (isVertical) {
        const yPos = xPos + shortIdWidth
        this.doc.rotate(-90, { origin: [yShortId, yPos] })
        this.doc.text(this.data.shortId, yShortId, yPos, textRenderOptions)
        this.doc.rotate(90, { origin: [yShortId, yPos] })
      } else {
        this.doc.text(this.data.shortId, xPos, yShortId, textRenderOptions)
      }
    })
  }

  // Creates a (width x height) sized cropmark at position (x, y) in the doc
  private createCropmarkAtPoint(
    x: number,
    y: number,
    cropmarkWidth: number,
    cropmarkHeight: number
  ) {
    this.doc
      // top line
      .moveTo(x - cropmarkWidth / 2 + bleedStrokeWidth, y - cropmarkHeight / 2)
      .lineTo(x + cropmarkWidth / 2 - bleedStrokeWidth, y - cropmarkHeight / 2)
      // right line
      .moveTo(x + cropmarkWidth / 2, y - cropmarkHeight / 2 + bleedStrokeWidth)
      .lineTo(x + cropmarkWidth / 2, y + cropmarkHeight / 2 - bleedStrokeWidth)
      // bottom line
      .moveTo(x + cropmarkWidth / 2 - bleedStrokeWidth, y + cropmarkHeight / 2)
      .lineTo(x - cropmarkWidth / 2 + bleedStrokeWidth, y + cropmarkHeight / 2)
      // left line
      .moveTo(x - cropmarkWidth / 2, y + cropmarkHeight / 2 - bleedStrokeWidth)
      .lineTo(x - cropmarkWidth / 2, y - cropmarkHeight / 2 + bleedStrokeWidth)
      .lineWidth(bleedStrokeWidth)
      .stroke()
  }

  // Prints a 5x5 grid of the provided image along with crop marks
  private printImageArray(
    image: string,
    { startX, startY, imageHeight, imageWidth, omitCropmarks = false }: PrintImageArrayOptions
  ) {
    // The width/height of the cropmarks are flipped for vertical vs. horizontal cards
    const cropmarkWidthHeightArgs = {
      vertical: [cropmarkHeight, cropmarkWidth],
      horizontal: [cropmarkWidth, cropmarkHeight],
    }[this.orientation]

    // Print the grid of card images
    let i = 0
    let j = 0
    for (i = 0; i < 5; i += 1) {
      for (j = 0; j < 5; j += 1) {
        const x = startX + imageWidth * i
        const y = startY + imageHeight * j

        this.doc.image(image, x, y, {
          align: 'center',
          valign: 'center',
          width: imageWidth,
          height: imageHeight,
          cover: [imageWidth, imageHeight],
        })

        // Only for debugging: outline each card so we can tell where it starts and ends
        // this.doc.rect(x, y, imageWidth, imageHeight).stroke()

        if (!omitCropmarks) {
          // Crop mark top left
          this.createCropmarkAtPoint(x, y, cropmarkWidthHeightArgs[0], cropmarkWidthHeightArgs[1])
          // Crop mark top right
          this.createCropmarkAtPoint(
            x + imageWidth,
            y,
            cropmarkWidthHeightArgs[0],
            cropmarkWidthHeightArgs[1]
          )
          // Crop mark bottom right
          this.createCropmarkAtPoint(
            x + imageWidth,
            y + imageHeight,
            cropmarkWidthHeightArgs[0],
            cropmarkWidthHeightArgs[1]
          )
          // Crop mark bottom left
          this.createCropmarkAtPoint(
            x,
            y + imageHeight,
            cropmarkWidthHeightArgs[0],
            cropmarkWidthHeightArgs[1]
          )
        }
      }
    }
  }
}
