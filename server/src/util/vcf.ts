import * as fs from 'fs'
import path from 'path'
import vCards from 'vcards-js'

type vCard = ReturnType<typeof vCards>

const VCF_FOLDER = '/tmp/vcf'

export const saveVCFToFile = (vCard: vCard, filename: string): string => {
  // Create the /tmp/vcf folder to put vcf's in as we prepare the download

  const filePath = path.join(VCF_FOLDER, filename)
  if (!fs.existsSync(VCF_FOLDER)) {
    fs.mkdirSync(VCF_FOLDER)
  }

  vCard.saveToFile(filePath)
  return filePath
}
