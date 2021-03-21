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
