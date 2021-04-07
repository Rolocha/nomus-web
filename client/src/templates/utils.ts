import { rgba } from 'polished'
import templateLibrary from 'src/templates'
import { TemplateOptionsType } from 'src/components/TemplateCard/types'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { TemplateID } from 'src/pages/CardBuilder/types'
import { colors } from 'src/styles'
import { ImageDimensions } from 'src/utils/image'

export const createNFCTapIconSVG = ({
  color = colors.nomusBlue,
}: {
  color: string
}) =>
  encodeURIComponent(`
<svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.27595 8.39361C1.21395 8.39361 1.15295 8.37361 1.10095 8.33261C0.977947 8.23561 0.956946 8.05661 1.05395 7.93461C1.48295 7.39161 1.70894 6.76161 1.70894 6.11061C1.70894 5.45261 1.47795 4.81661 1.04095 4.27061C0.943946 4.14861 0.962944 3.96961 1.08494 3.87261C1.20694 3.77461 1.38495 3.79361 1.48395 3.91661C2.00195 4.56361 2.27595 5.32261 2.27595 6.11061C2.27595 6.89061 2.00695 7.64261 1.49895 8.28561C1.44295 8.35661 1.35995 8.39361 1.27595 8.39361Z" fill="${color}"/>
  <path d="M3.87199 9.65661C3.81299 9.65661 3.75399 9.63861 3.70299 9.60061C3.57699 9.50661 3.55199 9.32961 3.64499 9.20461C4.33499 8.27861 4.70099 7.20861 4.70099 6.11161C4.70099 5.01461 4.33599 3.94461 3.64499 3.01861C3.55099 2.89361 3.57699 2.71561 3.70299 2.62161C3.82799 2.52761 4.00599 2.55361 4.09899 2.67961C4.86299 3.70461 5.26699 4.89061 5.26699 6.11161C5.26699 7.33261 4.86299 8.51861 4.09899 9.54361C4.04299 9.61661 3.95799 9.65661 3.87199 9.65661Z" fill="${color}"/>
  <path d="M6.09191 10.7396C6.03391 10.7396 5.97491 10.7216 5.92491 10.6846C5.79891 10.5926 5.77091 10.4146 5.86391 10.2886C6.77991 9.03461 7.26391 7.58861 7.26391 6.10961C7.26391 4.62961 6.77991 3.1846 5.86291 1.9296C5.77091 1.8036 5.79791 1.6256 5.92391 1.5336C6.04991 1.4416 6.22691 1.46761 6.31991 1.59561C7.30791 2.94861 7.83091 4.50961 7.83091 6.10961C7.83091 7.71061 7.30891 9.27161 6.32091 10.6226C6.26591 10.6996 6.17891 10.7396 6.09191 10.7396Z" fill="${color}"/>
  <path d="M8.45799 11.8936C8.39999 11.8936 8.34199 11.8766 8.29199 11.8396C8.16499 11.7486 8.136 11.5716 8.228 11.4446C9.383 9.83959 9.99399 7.99459 9.99399 6.11059C9.99399 4.22559 9.383 2.38159 8.228 0.777591C8.136 0.650591 8.16499 0.473591 8.29199 0.382591C8.41799 0.291591 8.59499 0.31959 8.68699 0.44659C9.91299 2.14759 10.56 4.10559 10.56 6.11059C10.56 8.11459 9.912 10.0736 8.686 11.7756C8.632 11.8526 8.54599 11.8936 8.45799 11.8936Z" fill="${color}"/>
</svg>
  `)
export const createNomusLogoSVG = ({
  color = colors.nomusBlue,
}: {
  color: string
}) =>
  encodeURIComponent(`
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.195945 3.92257C0.546945 2.76157 1.29594 1.69857 2.32194 0.996573C2.83094 0.642573 3.40094 0.370573 4.00294 0.199573C4.60594 0.0355728 5.23794 -0.0324271 5.86394 0.0145729C6.48994 0.0565729 7.11094 0.196573 7.69594 0.433573C8.28094 0.672573 8.81495 1.02657 9.28395 1.44657C9.74895 1.87057 10.1639 2.36057 10.4579 2.92057C10.7559 3.47657 10.9639 4.07957 11.0699 4.69857C11.1819 5.31857 11.1669 5.95357 11.0689 6.57057C10.9669 7.18657 10.7739 7.79057 10.4709 8.33557C9.87395 9.42457 8.93894 10.3346 7.80194 10.8306C7.23794 11.0826 6.63594 11.2456 6.02294 11.3076C5.71594 11.3226 5.40795 11.3416 5.10095 11.3196C4.79395 11.2956 4.48995 11.2506 4.19095 11.1806C2.99495 10.8996 1.90694 10.2076 1.14194 9.25757C1.11594 9.22557 1.12094 9.17757 1.15394 9.15157C1.18594 9.12557 1.23194 9.13057 1.25794 9.16057L1.25894 9.16157C2.03594 10.0596 3.10794 10.6826 4.25294 10.9086C4.53894 10.9646 4.82894 10.9956 5.11994 11.0086C5.41094 11.0196 5.69994 10.9896 5.98794 10.9656C6.56194 10.8866 7.11795 10.7136 7.63195 10.4606C8.66595 9.96157 9.50095 9.09557 9.98995 8.08357C10.2409 7.57857 10.3879 7.02857 10.4499 6.47657C10.5069 5.92357 10.4909 5.36057 10.3619 4.82557C10.2429 4.28957 10.0469 3.77357 9.77095 3.30357C9.49195 2.83657 9.14994 2.40657 8.74594 2.04257C8.34294 1.67757 7.88095 1.38257 7.38795 1.15057C6.88995 0.927573 6.35595 0.790573 5.81095 0.728573C5.26395 0.658573 4.70394 0.693573 4.16094 0.808573C3.61494 0.916573 3.08294 1.11857 2.59194 1.40457C2.10094 1.69057 1.65795 2.06157 1.26195 2.48557C0.867947 2.91357 0.547945 3.41357 0.291945 3.95457L0.289946 3.95857C0.277946 3.98357 0.247945 3.99457 0.222945 3.98257C0.198945 3.97257 0.187945 3.94657 0.195945 3.92257Z" fill="${color}"/>
  <path d="M5.21289 6.21559C5.14889 6.21559 5.08789 6.19059 5.04289 6.14559C4.99589 6.09859 4.97089 6.03459 4.97289 5.96859C4.97489 5.91459 5.02189 4.63359 5.86089 3.79459C6.70189 2.95359 7.57589 2.69659 8.03389 3.15459C8.49289 3.61359 8.23489 4.48659 7.39389 5.32759C6.55489 6.16659 5.27389 6.21459 5.21989 6.21559C5.21789 6.21559 5.21489 6.21559 5.21289 6.21559ZM7.44889 3.40959C7.16089 3.40959 6.70689 3.62759 6.20089 4.13459C5.71189 4.62359 5.54189 5.32259 5.48289 5.70559C5.86589 5.64659 6.56489 5.47659 7.05389 4.98759C7.74689 4.29459 7.90089 3.70159 7.69389 3.49459C7.63789 3.43859 7.55489 3.40959 7.44889 3.40959Z" fill="${color}"/>
  <path d="M3.59595 5.55962C3.53995 5.55962 3.48595 5.54062 3.44195 5.50462C3.41095 5.47862 2.69295 4.87062 2.92195 4.01062C3.01695 3.65362 3.21995 3.36962 3.49295 3.21162C3.70895 3.08662 3.95595 3.05262 4.18695 3.11362C4.42195 3.17662 4.61995 3.33262 4.74495 3.55262C4.90095 3.82762 4.93295 4.17262 4.83295 4.52562C4.59895 5.35762 3.68095 5.54762 3.64195 5.55562C3.62695 5.55762 3.61195 5.55962 3.59595 5.55962ZM3.95795 3.56462C3.88295 3.56462 3.80695 3.58562 3.73395 3.62762C3.57495 3.71962 3.44795 3.90462 3.38695 4.13462C3.27495 4.55462 3.52395 4.89762 3.66395 5.05062C3.86195 4.98262 4.25595 4.80062 4.37095 4.39562C4.43395 4.17062 4.41795 3.95062 4.32695 3.79062C4.26495 3.68162 4.17295 3.60862 4.06195 3.57862C4.02795 3.56862 3.99295 3.56462 3.95795 3.56462Z" fill="${color}"/>
  <path d="M6.83993 8.31061C6.16293 8.31061 5.70593 7.77161 5.68393 7.74561C5.63793 7.68961 5.61893 7.61661 5.63293 7.54561C5.64093 7.50661 5.82993 6.58961 6.66293 6.35461C7.01493 6.25561 7.36093 6.28661 7.63493 6.44261C7.85493 6.56761 8.01093 6.76561 8.07393 7.00061C8.13593 7.23261 8.10093 7.47861 7.97593 7.69461C7.81793 7.96761 7.53393 8.17061 7.17693 8.26561C7.05993 8.29761 6.94693 8.31061 6.83993 8.31061ZM6.13793 7.52361C6.28993 7.66361 6.63493 7.91361 7.05493 7.80161C7.28493 7.74061 7.46893 7.61361 7.56193 7.45461C7.62393 7.34861 7.64093 7.23461 7.61093 7.12561C7.58093 7.01461 7.50793 6.92261 7.39893 6.86061C7.23893 6.76961 7.01893 6.75361 6.79493 6.81761C6.38393 6.93261 6.20393 7.32561 6.13793 7.52361Z" fill="${color}"/>
  <path d="M3.0219 5.68857C2.8009 5.68857 2.5849 5.61657 2.4039 5.47857C2.1469 5.28257 1.9989 4.98557 1.9989 4.66157V4.42157H2.4799V4.66157C2.4799 4.83357 2.5579 4.99157 2.6949 5.09557C2.8319 5.19957 3.0049 5.23257 3.1699 5.18657L3.7639 5.02257L3.8919 5.48557L3.2989 5.64957C3.2069 5.67657 3.1139 5.68857 3.0219 5.68857Z" fill="${color}"/>
  <path d="M5.77995 7.8426L5.54095 7.6036C5.21695 7.2796 4.98995 6.7166 4.96495 6.2236C4.47195 6.1986 3.90795 5.9716 3.58495 5.6476L3.34595 5.4086L3.68595 5.0686L3.92495 5.3076C4.20395 5.5866 4.79195 5.7866 5.18295 5.7376C5.25695 5.7276 5.33095 5.7536 5.38295 5.8056C5.43595 5.8586 5.46095 5.9326 5.45195 6.0056C5.40195 6.3966 5.60295 6.9846 5.88195 7.2636L6.12094 7.5026L5.77995 7.8426Z" fill="${color}"/>
  <path d="M6.80588 9.22857H6.52988C6.21388 9.22857 5.91988 9.08657 5.72388 8.83757C5.52788 8.58858 5.45789 8.27057 5.53189 7.96257L5.69089 7.30157L6.15789 7.41457L5.99988 8.07557C5.96088 8.23857 5.99789 8.40858 6.10189 8.54058C6.20589 8.67257 6.36188 8.74857 6.52988 8.74857H6.80588V9.22857Z" fill="${color}"/>
</svg>
  `)

export const RGBA_REGEX = /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
// Converts rgb(...) or rgba(...) shaped strings to a hex color string
export const rgb2hex = (rgb: string) => {
  const rgbMatch = rgb.match(RGBA_REGEX)
  return rgbMatch && rgbMatch.length === 4
    ? '#' +
        ('0' + parseInt(rgbMatch[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgbMatch[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgbMatch[3], 10).toString(16)).slice(-2)
    : ''
}

export const drawOuterBleed = (
  canvas: HTMLCanvasElement,
  cardDimensions: ImageDimensions,
) => {
  // Draw the image onto a canvas each time it changes or we toggle showGuides
  const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
  const xBleedPct = xBleed / cardWidth
  const yBleedPct = yBleed / cardHeight

  // if (canvas) {
  const context = canvas.getContext('2d')!

  // const cardDimensions = await getImageDimensions(cardImageUrl)

  const actualXBleed = cardDimensions.width * xBleedPct
  const actualYBleed = cardDimensions.height * yBleedPct

  canvas.width = cardDimensions.width
  canvas.height = cardDimensions.height

  // if (showGuides) {
  // Draw outer bleed
  const outerBleedWidth = cardDimensions.width + actualXBleed * 2
  const outerBleedHeight = cardDimensions.height + actualYBleed * 2
  // Update canvas dimensions to include bleed
  canvas.width = outerBleedWidth
  canvas.height = outerBleedHeight

  context.fillStyle = rgba(colors.gold, 0.5)
  context.fillRect(0, 0, outerBleedWidth, outerBleedHeight)
  // }
}

export const drawInnerBleed = (
  canvas: HTMLCanvasElement,
  cardDimensions: ImageDimensions,
) => {
  // Draw the image onto a canvas each time it changes or we toggle showGuides
  const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
  const xBleedPct = xBleed / cardWidth
  const yBleedPct = yBleed / cardHeight

  // if (canvas) {
  const context = canvas.getContext('2d')!

  // const cardDimensions = await getImageDimensions(cardImageUrl)

  const actualXBleed = cardDimensions.width * xBleedPct
  const actualYBleed = cardDimensions.height * yBleedPct

  const innerBleedWidth = cardDimensions.width - actualXBleed * 2
  const innerBleedHeight = cardDimensions.height - actualYBleed * 2

  context.strokeStyle = colors.brightCoral
  context.setLineDash([6])
  context.strokeRect(
    actualXBleed * 2,
    actualYBleed * 2,
    innerBleedWidth,
    innerBleedHeight,
  )
}

// Converts template customization form fields into the actual options to be passed in to the form.
// This mapping is generally 1:1 but differs for the following field types
// - file: the form uses FileItem but the template only accepts the URL
export const createOptionsFromForm = (
  templateId: TemplateID,
  formFields: Record<string, any>,
) => {
  const { customizableOptions: customization } = templateLibrary[templateId]
  const customizationKeys = Object.keys(
    customization,
  ) as (keyof typeof customization)[]

  return customizationKeys.reduce((acc, customizationKey) => {
    const customizationDetails = customization[customizationKey]
    switch (customizationDetails.type) {
      case 'file':
        // debugger
        acc[customizationKey] = formFields[customizationKey]?.url ?? undefined
        break
      default:
        acc[customizationKey] = formFields[customizationKey]
    }
    return acc
  }, {} as any)
}

export async function templateToImageDataUrl<T extends TemplateID>(
  templateId: T,
  options: TemplateOptionsType<T>,
) {
  const frontCanvas = document.createElement('canvas')
  const backCanvas = document.createElement('canvas')
  await templateLibrary[templateId].renderFront(frontCanvas, options)
  await templateLibrary[templateId].renderBack(backCanvas, options)
  return {
    front: frontCanvas.toDataURL('image/png'),
    back: backCanvas.toDataURL('image/png'),
  }
}
