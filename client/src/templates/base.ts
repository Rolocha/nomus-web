import QRCode from 'qrcode'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import {
  createNFCTapIconSVG,
  createNomusLogoSVG,
  RGBA_REGEX,
  rgb2hex,
} from './utils'

const RESOLUTION_FACTOR = 5

export interface GenericCustomizableFieldSpec<T> {
  type: 'text' | 'color' | 'file' | 'range'
  label?: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  hidden?: (options: T) => boolean
}
export interface CustomizableRangeFieldSpec<T>
  extends GenericCustomizableFieldSpec<T> {
  type: 'range'
  range: {
    min: number
    max: number
    step: number
  }
}

export type CustomizableFieldSpec<T> =
  | CustomizableRangeFieldSpec<T>
  | GenericCustomizableFieldSpec<T>

export interface BaseCardOptions<T> {
  name: string
  width: number
  height: number
  demoImageUrl: string
  customizableOptions: Record<keyof T, CustomizableFieldSpec<T>>
  renderFront: (canvas: HTMLCanvasElement, options: T) => void | Promise<void>
  renderBack: (canvas: HTMLCanvasElement, options: T) => void | Promise<void>
}

interface RenderResponse {
  isComplete: boolean
}

export default class CardTemplate<T> {
  public name: BaseCardOptions<T>['name']
  public customizableOptions: BaseCardOptions<T>['customizableOptions']
  public width: BaseCardOptions<T>['width']
  public height: BaseCardOptions<T>['height']
  public demoImageUrl: BaseCardOptions<T>['demoImageUrl']

  private _renderFront: BaseCardOptions<T>['renderFront']
  private _renderBack: BaseCardOptions<T>['renderBack']
  private userSpecifiedOptions: T | null = null

  constructor(opts: BaseCardOptions<T>) {
    this.name = opts.name
    this.width = opts.width
    this.height = opts.height
    this.demoImageUrl = opts.demoImageUrl
    this.customizableOptions = opts.customizableOptions
    this._renderFront = opts.renderFront
    this._renderBack = opts.renderBack
  }

  get usableWidth() {
    return this.proportionalize(this.width)
  }
  get usableHeight() {
    return this.proportionalize(this.height)
  }

  get isComplete(): boolean {
    const customizableFields = Object.keys(
      this.customizableOptions,
    ) as (keyof T)[]
    return customizableFields.every(
      (field) =>
        !this.customizableOptions[field].required ||
        (this.userSpecifiedOptions && this.userSpecifiedOptions[field]),
    )
  }

  get bleed(): { x: number; y: number } {
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.usableWidth * xBleedPct
    const actualYBleed = this.usableHeight * yBleedPct
    return { x: actualXBleed, y: actualYBleed }
  }

  get customizableFieldNames(): (keyof BaseCardOptions<T>['customizableOptions'])[] {
    return Object.keys(this.customizableOptions) as any[]
  }

  // Converts the template's customization options into an object that can be provided
  // to Storybook's argTypes property for rendering UI controls
  // See https://storybook.js.org/docs/react/essentials/controls
  get storybookArgTypes() {
    return this.customizableFieldNames.reduce<any>(
      (acc, customizableFieldName) => {
        const fieldDetails = this.customizableOptions[customizableFieldName]
        acc[customizableFieldName] = {
          control: {
            type: fieldDetails.type,
          },
        }

        if (fieldDetails.type === 'range') {
          const rangeFieldDetails = fieldDetails as CustomizableRangeFieldSpec<any>
          acc[customizableFieldName].control.min = rangeFieldDetails.range.min
          acc[customizableFieldName].control.max = rangeFieldDetails.range.max
          acc[customizableFieldName].control.step = rangeFieldDetails.range.step
        }
        return acc
      },
      {},
    )
  }

  clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  waitForImageToLoad(img: HTMLImageElement): Promise<void> {
    return new Promise((res) => {
      img.addEventListener('load', () => {
        res()
      })
    })
  }

  async renderFront(
    canvas: HTMLCanvasElement,
    options: T,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.usableHeight
    canvas.width = this.usableWidth
    await this._renderFront(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  async renderBack(
    canvas: HTMLCanvasElement,
    options: T,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.usableHeight
    canvas.width = this.usableWidth
    await this._renderBack(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  proportionalize(val: number) {
    return val * RESOLUTION_FACTOR
  }

  drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, this.usableWidth, this.usableHeight)
  }

  drawInnerBleed(ctx: CanvasRenderingContext2D) {
    // Draw the image onto a canvas each time it changes or we toggle showGuides
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.usableWidth * xBleedPct
    const actualYBleed = this.usableHeight * yBleedPct

    const innerBleedWidth = this.usableWidth - actualXBleed * 2
    const innerBleedHeight = this.usableHeight - actualYBleed * 2

    ctx.strokeStyle = colors.brightCoral
    ctx.setLineDash([this.proportionalize(6)])
    ctx.strokeRect(
      actualXBleed,
      actualYBleed,
      innerBleedWidth,
      innerBleedHeight,
    )
  }

  // Writes text vertically centered within the canvas with the top of the text at the specified y value
  drawTextHorizontallyCenteredAtY(
    ctx: CanvasRenderingContext2D,
    text: string,
    y: number,
  ): TextMetrics {
    const textMeasurements = ctx.measureText(text)
    const textX = (this.usableWidth - textMeasurements.width) / 2
    ctx.fillText(text, textX, y)
    return textMeasurements
  }

  async drawNomusLogo(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNomusLogoSVG({ color })
    const img = document.createElement('img')
    img.src = 'data:image/svg+xml,' + svgMarkup
    await this.waitForImageToLoad(img)
    ctx.drawImage(img, x, y, size, size)
  }

  async drawNFCTapIcon(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNFCTapIconSVG({ color })
    const img = document.createElement('img')
    img.src = 'data:image/svg+xml,' + svgMarkup
    await this.waitForImageToLoad(img)
    ctx.drawImage(img, x, y, size, size)
  }

  async drawQRCode(
    ctx: CanvasRenderingContext2D,
    qrUrl: string,
    {
      x,
      y,
      width,
      height,
      foregroundColor = '#000',
      backgroundColor = '#fff',
    }: {
      x: number
      y: number
      width: number
      height: number
      foregroundColor?: string
      backgroundColor?: string
    },
  ): Promise<void> {
    if (!qrUrl) {
      console.warn('qrUrl was empty')
      return
    }
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      margin: 0,
      color: {
        dark: foregroundColor.match(RGBA_REGEX)
          ? rgb2hex(foregroundColor)
          : foregroundColor,
        light: backgroundColor.match(RGBA_REGEX)
          ? rgb2hex(backgroundColor)
          : backgroundColor,
      },
    })
    const qrImg = document.createElement('img')
    qrImg.src = qrDataUrl
    await this.waitForImageToLoad(qrImg)
    ctx.drawImage(qrImg, x, y, width, height)
  }
}
