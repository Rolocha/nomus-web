import React from 'react'

export interface ImageDimensions {
  width: number
  height: number
}

export const getImageDimensions = async (
  src: string,
): Promise<ImageDimensions> => {
  const imgElement = document.createElement('img')
  imgElement.src = src
  return new Promise((res) => {
    imgElement.addEventListener('load', () => {
      res({
        width: imgElement.naturalWidth,
        height: imgElement.naturalHeight,
      })
    })
  })
}

type UseImageDimensionsResult = ImageDimensions | 'determining' | null

export const useImageDimensions = (imageUrl: string | null) => {
  const [imageDimensions, setImageDimensions] = React.useState<
    UseImageDimensionsResult
  >(null)

  React.useEffect(() => {
    if (imageDimensions == null && imageUrl) {
      setImageDimensions('determining')
      getImageDimensions(imageUrl).then(setImageDimensions)
    }
  }, [imageUrl, imageDimensions])

  return imageDimensions
}

export const useImageOrientation = (imageUrl: string | null) => {
  const imageDimensions = useImageDimensions(imageUrl)
  const imageOrientation = React.useMemo(() => {
    if (imageDimensions === 'determining' || imageDimensions == null) {
      return 'unknown'
    }
    return imageDimensions.height > imageDimensions.width
      ? 'vertical'
      : 'horizontal'
  }, [imageDimensions])
  return imageOrientation
}

export const dataURItoBlob = (dataURI: string) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1])
  else byteString = unescape(dataURI.split(',')[1])

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], { type: mimeString })
}

export const imageUrlToFile = async (
  imageUrl: string,
  name: string = 'file',
): Promise<File> => {
  const fetchedImage = await fetch(imageUrl)
  const blob = await fetchedImage.blob()
  const file = new File([blob], name)
  return file
}
