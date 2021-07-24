import path from 'path'
import fs from 'fs'
import PrintSpec from './print-spec'

describe('PrintSpec', () => {
  describe('generatePDF', () => {
    it.each(['horizontal', 'vertical'])('generates a PDF for %s cards', async (orientation) => {
      const frontPath = path.join(__dirname, 'test-assets', `${orientation}-front.png`)
      const backPath = path.join(__dirname, 'test-assets', `${orientation}-back.png`)

      const printSpec = new PrintSpec({
        frontImageLocalFilePath: frontPath,
        backImageLocalFilePath: backPath,
        shortId: 'SJC123',
      })
      const pdfPath = await printSpec.generatePDF({
        numSheets: 2,
        // Uncomment the following line if you need to update the PDF files in the
        // test-assets directory to visually verify that they are generating correctly.
        // filepath: path.join(__dirname, 'test-assets', `${orientation}-print-spec.pdf`),
      })

      // Until we figure out how to get PDF snapshot testing working
      // in CI, this is the best we can do. :/
      expect(pdfPath).toBeTruthy()
      expect(fs.statSync(pdfPath).size).toBeGreaterThan(10000)
    })
  })
})
