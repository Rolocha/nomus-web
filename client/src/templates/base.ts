import QRCode from 'qrcode'
import { specMeasurements } from 'src/pages/CardBuilder/config'
import { colors } from 'src/styles'
import { CustomizableField, CustomizableFieldSpec } from './customization'
import {
  createNFCTapIconSVG,
  createNomusLogoSVG,
  rgb2hex,
  RGBA_REGEX,
} from './utils'

// The scaling factor for how much we increase the resolution
// of the template cards when rendered - might make sense to
// move this to TemplateCard
const RESOLUTION_FACTOR = 5

export type CardTemplateRenderOptions = {
  colorScheme: Record<string, CustomizableField.Color>
  contactInfo: Record<string, CustomizableField.ContactInfo | null>
  graphic: CustomizableField.Graphic
  qrCodeUrl: CustomizableField.QRCode
  omittedContactInfoFields: Array<string>
}

export interface CardTemplateDefinition {
  name: string
  width: number
  height: number
  demoImageUrl: string
  colorScheme: Record<string, CustomizableFieldSpec.Color>
  contactInfo: Record<string, CustomizableFieldSpec.ContactInfo>

  renderFront: (
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ) => void | Promise<void>
  renderBack: (
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ) => void | Promise<void>
}

interface RenderResponse {
  isComplete: boolean
}

// Instances of CardTemplate represent specific templates that we offer
// e.g.
// const VeliaTemplate = new CardTemplate(veliaTemplateDefinition)
//
// Using this instance also gives the template definition's render functions
// access to useful utility methods such as drawNomusLogo, drawQRCode, etc.
export default class CardTemplate {
  public name: string
  public width: number
  public height: number
  public demoImageUrl: string
  public contactInfoSpec: CardTemplateDefinition['contactInfo']
  public colorSchemeSpec: CardTemplateDefinition['colorScheme']

  private _renderFront: CardTemplateDefinition['renderFront']
  private _renderBack: CardTemplateDefinition['renderBack']
  private userSpecifiedOptions: CardTemplateRenderOptions | null = null

  constructor(templateDefinition: CardTemplateDefinition) {
    this.name = templateDefinition.name
    this.width = templateDefinition.width
    this.height = templateDefinition.height
    this.demoImageUrl = templateDefinition.demoImageUrl
    this.colorSchemeSpec = templateDefinition.colorScheme
    this.contactInfoSpec = templateDefinition.contactInfo
    this._renderFront = templateDefinition.renderFront
    this._renderBack = templateDefinition.renderBack
  }

  /**
   * Various useful getters
   */

  public get proportionalizedWidth() {
    return this.proportionalize(this.width)
  }
  public get proportionalizedHeight() {
    return this.proportionalize(this.height)
  }
  public get contactInfoFieldNames(): (keyof CardTemplateDefinition['contactInfo'])[] {
    return Object.keys(this.contactInfoSpec) as any[]
  }
  public get colorKeys(): (keyof CardTemplateDefinition['colorScheme'])[] {
    return Object.keys(this.colorSchemeSpec) as any[]
  }

  public get isComplete(): boolean {
    return this.contactInfoFieldNames.every(
      (field) =>
        // Either the spec says this field is not required
        !this.contactInfoSpec[field].required ||
        // or the field is present in the user-specified options
        (this.userSpecifiedOptions &&
          this.userSpecifiedOptions.contactInfo[field]),
    )
  }

  public get defaultOptions(): CardTemplateRenderOptions {
    return {
      contactInfo: this.contactInfoFieldNames.reduce((acc, fieldName) => {
        if (this.contactInfoSpec[fieldName].required) {
          acc[fieldName] = ''
        } else {
          acc[fieldName] = null
        }
        return acc
      }, {} as Partial<Record<string, any>>),
      colorScheme: this.colorKeys.reduce((acc, fieldName) => {
        if (this.colorSchemeSpec[fieldName].defaultValue) {
          acc[fieldName] = this.colorSchemeSpec[fieldName].defaultValue
        }
        return acc
      }, {} as Record<string, string>),
      graphic: {
        url: null,
        size: 1,
      },
      qrCodeUrl: 'https://nomus.me',
      omittedContactInfoFields: [],
    }
  }

  /**
   * Core renderers
   *
   * The core public-facing methods of a template that allow you to render
   * the design onto HTMLCanvasElements
   */

  // Renders the front side of the card on the provided canvas element
  // using the specified options
  public async renderFrontToCanvas(
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.proportionalizedHeight
    canvas.width = this.proportionalizedWidth
    await this._renderFront(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  // Renders the back side of the card on the provided canvas element
  // using the specified options
  public async renderBackToCanvas(
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ): Promise<RenderResponse> {
    this.userSpecifiedOptions = options
    canvas.height = this.proportionalizedHeight
    canvas.width = this.proportionalizedWidth
    await this._renderBack(canvas, options)
    return {
      isComplete: this.isComplete,
    }
  }

  // Renders both the front and back of the cards each to a separate data URL string
  public async renderBothSidesToDataUrls(
    options: CardTemplateRenderOptions,
  ): Promise<{ front: string; back: string }> {
    const frontCanvas = document.createElement('canvas')
    const backCanvas = document.createElement('canvas')
    await this.renderFrontToCanvas(frontCanvas, options)
    await this.renderBackToCanvas(backCanvas, options)

    return {
      front: frontCanvas.toDataURL('image/png'),
      back: backCanvas.toDataURL('image/png'),
    }
  }

  /**
   * Template customizable field massagers
   *
   * For various use cases, the customizable options that are defined for each template need to
   * be massaged into different shapes for use with other tools like Storybook or Card Builder.
   * These data transformations should be done here to avoid leaking this abstraction.
   */

  // Converts the template's customization options into an object that can be provided
  // to Storybook's argTypes property for rendering UI controls
  // See https://storybook.js.org/docs/react/essentials/controls
  public get storybookArgTypes() {
    const args: Record<string, any> = {}
    this.contactInfoFieldNames.forEach((contactInfoFieldName) => {
      args[contactInfoFieldName] = {
        type: 'text',
      }
    })
    return args
  }

  // The Card Builder form values for templates *generally* map 1:1 to
  // the options we feed into the template renderer but in a few cases
  // we need to do some light massaging along the way. This function
  // lets us handle any such data transformations.
  public createOptionsFromFormFields(
    formFields: Record<string, any>,
    omittedFields: Array<string>,
  ): CardTemplateRenderOptions {
    const { graphic, ...otherFormFields } = formFields
    const result: any = {
      ...otherFormFields,
      graphic:
        graphic && graphic.file
          ? {
              url: graphic.file.url,
              size: graphic.size,
            }
          : null,
      omittedContactInfoFields: omittedFields
        ? omittedFields.map((field) => field.replace('contactInfo.', ''))
        : [],
    }
    return result
  }

  /**
   * Canvas drawing helpers
   *
   * These should ~all be marked as 'protected' since they'll only need to be used
   * by the renderFront/renderBack methods of templates that instatiate this class
   */

  protected get bleed(): { x: number; y: number } {
    const { cardWidth, cardHeight, xBleed, yBleed } = specMeasurements
    const xBleedPct = xBleed / cardWidth
    const yBleedPct = yBleed / cardHeight

    const actualXBleed = this.proportionalizedWidth * xBleedPct
    const actualYBleed = this.proportionalizedHeight * yBleedPct
    return { x: actualXBleed, y: actualYBleed }
  }

  protected async createImage(src: string): Promise<HTMLImageElement> {
    const img = document.createElement('img')
    img.src = src
    // Needed in order to allow canvas rendering on different origins
    // such as when rendering in Storybook
    img.crossOrigin = 'anonymous'
    await this.waitForImageToLoad(img)
    return img
  }

  protected waitForImageToLoad(img: HTMLImageElement): Promise<void> {
    return new Promise((res) => {
      img.addEventListener('load', () => {
        res()
      })
    })
  }

  // Proportionalizes a canvas coordinate value to match the resolution factor
  protected proportionalize(val: number) {
    return val * RESOLUTION_FACTOR
  }

  protected clearCanvas(canvas: HTMLCanvasElement) {
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }

  // Draws a 2px black border around the entire card
  public drawBorder(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(
      0,
      0,
      this.proportionalizedWidth,
      this.proportionalizedHeight,
    )
  }

  public drawInnerBleed(ctx: CanvasRenderingContext2D) {
    const { x: actualXBleed, y: actualYBleed } = this.bleed

    const innerBleedWidth = this.proportionalizedWidth - actualXBleed * 2
    const innerBleedHeight = this.proportionalizedHeight - actualYBleed * 2

    ctx.strokeStyle = colors.brightCoral
    ctx.setLineDash([this.proportionalize(6)])
    ctx.strokeRect(
      actualXBleed,
      actualYBleed,
      innerBleedWidth,
      innerBleedHeight,
    )
  }

  // Renders text that wraps when it grows beyond the specified maxWidth
  protected wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    positioning: {
      anchorTo: 'bottom' | 'top'
      x: number
      y: number
      maxWidth: number
      lineHeight: number
    },
  ): { width: number; height: number } {
    const { x, y, maxWidth, lineHeight, anchorTo } = positioning
    const totalMeasurements = { width: 0, height: 0 }

    const words = {
      top: text.split(' '),
      bottom: text.split(' ').reverse(),
    }[anchorTo]

    // The anchorTo we adjust line height each time depends on which way we're wrapping
    const lineHeightDelta = {
      top: lineHeight,
      bottom: -lineHeight,
    }[anchorTo]

    let currentY = y

    const writeLine = (text: string) => {
      const measured = ctx.measureText(text)
      totalMeasurements.width = Math.max(
        totalMeasurements.width,
        measured.width,
      )
      totalMeasurements.height += lineHeight
      ctx.fillText(text, x, currentY)
      currentY += lineHeightDelta
    }

    // Maintain a queue of words that will fit on the current line
    // and render it then clear it once we're ready to draw the line
    let lineOfWordsQueue: string[] = []
    words.forEach((candidateWord) => {
      // See if the current line fits within the specified maxWidth
      const candidateLineContents = {
        top: [...lineOfWordsQueue, candidateWord],
        bottom: [candidateWord, ...lineOfWordsQueue],
      }[anchorTo]
      const candidateLineText = candidateLineContents.join(' ')
      const currentLineMeasurements = ctx.measureText(
        candidateLineContents.join(' '),
      )
      const candidateWordFits = currentLineMeasurements.width <= maxWidth
      const candidateWordWouldBeAloneOnTheLine = lineOfWordsQueue.length === 0

      if (!candidateWordFits && candidateWordWouldBeAloneOnTheLine) {
        // This word is already too wide even though it's the only one on this line
        // so draw it anyways because that's the best we can do
        writeLine(candidateLineText)
      } else if (candidateWordFits) {
        // The current line contents fit, add the next word in there and let's keep going
        lineOfWordsQueue = candidateLineContents
      } else {
        // This line would be too wide if we added candidateWord; draw the words queued so far
        // and add the overflowed word to wordsQueuedForRenderOnCurrentLine
        writeLine(lineOfWordsQueue.join(' '))
        lineOfWordsQueue = [candidateWord]
      }
    })

    // If there are words left in the queue, write them
    writeLine(lineOfWordsQueue.join(' '))
    return totalMeasurements
  }

  protected async drawNomusLogo(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNomusLogoSVG({ color })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(img, x, y, size, size)
  }

  protected async drawNFCTapIcon(
    ctx: CanvasRenderingContext2D,
    {
      x,
      y,
      size,
      color = '#000',
    }: { x: number; y: number; size: number; color?: string },
  ): Promise<void> {
    const svgMarkup = createNFCTapIconSVG({ color })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(img, x, y, size, size)
  }

  protected async drawQRCode(
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
    const qrImg = await this.createImage(qrDataUrl)
    ctx.drawImage(qrImg, x, y, width, height)
  }
}
