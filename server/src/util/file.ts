import https from 'https'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { IncomingMessage } from 'http'

export const downloadUrlToFile = async (
  url: string,
  filename: string,
  tmpDirName: string = 'download'
) => {
  // Set up a tmp dir / file to download to
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), tmpDirName))
  const localFilePath = path.join(tmpDir, `/${filename}`)
  const file = fs.createWriteStream(localFilePath)

  // Listen for when the file write stream is finished
  const fileReadPromise = new Promise<void>((resolve) => {
    file.addListener('finish', resolve)
  })

  // Kick off the GET request and pipe the resposne to the file
  const fileResponse = await new Promise<IncomingMessage>((resolve, reject) => {
    https.get(url, (response) => {
      resolve(response)
    })
  })
  fileResponse.pipe(file)
  await fileReadPromise

  return localFilePath
}
