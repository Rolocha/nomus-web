import * as React from 'react'

export default (file: File | null) => {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setDataUrl(String(e.target?.result))
        }
      }

      fileReader.readAsDataURL(file)
    }
  }, [file])
  return dataUrl
}
