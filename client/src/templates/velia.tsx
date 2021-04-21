import { lighten } from 'polished'
import { colors } from 'src/styles'
import CardTemplate, { UserSpecifiedOptions } from 'src/templates/base'

// export interface VeliaOptions {
//   colorScheme:

//   name: CustomizableField.ContactInfo
//   headline: CustomizableField.ContactInfo
//   line1?: CustomizableField.ContactInfo
//   line2?: CustomizableField.ContactInfo
//   line3?: CustomizableField.ContactInfo
//   footer?: CustomizableField.ContactInfo
//   qrUrl: CustomizableField.QRCode
//   backgroundColor?: CustomizableField.Color
//   accentColor?: CustomizableField.Color
//   textColor: CustomizableField.Color
//   logo: CustomizableField.Logo
// }

export type VeliaContactFields =
  | 'name'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'headline'
  | 'footer'
export type VeliaExtendedColors = never

const Velia = new CardTemplate<VeliaContactFields, VeliaExtendedColors>({
  name: 'Velia',
  width: 252,
  height: 144,
  demoImageUrl:
    'https://user-images.githubusercontent.com/8083680/112780178-25e20780-8ffd-11eb-96ec-f1eecbe102de.png',
  colorScheme: {
    background: {
      defaultValue: '#ffffff',
    },
    accent: {
      defaultValue: colors.nomusBlue,
    },
    text: {
      defaultValue: colors.midnightGray,
    },
  },
  contactInfo: {
    name: {
      label: 'Name',
      required: true,
      placeholder: 'John Appleseed',
    },
    headline: {
      label: 'Headline',
      required: true,
      placeholder: 'Businessperson',
    },
    line1: {
      label: 'Line 1',
      placeholder: '(555)-555-5555',
    },
    line2: {
      label: 'Line 2',
      placeholder: 'john@appleseed.com',
    },
    line3: {
      label: 'Line 3',
    },
    footer: {
      label: 'Footer',
      placeholder: 'An apple a day keeps the doctor away',
    },
    // qrUrl: {
    //   type: CustomizableFieldType.QRCode,
    //   label: 'QR Code URL',
    //   placeholder: 'https://nomus.me',
    // },
    // logo: {
    //   type: CustomizableFieldType.Logo,
    //   size: {
    //     min: 0.1,
    //     max: 1,
    //     step: 0.05,
    //     defaultValue: 0.8,
    //   },
    // },
    // backgroundColor: {
    //   type: CustomizableFieldType.Color,
    //   label: 'Background color',
    //   defaultValue: colors.white,
    // },
    // accentColor: {
    //   type: CustomizableFieldType.Color,
    //   label: 'Accent color',
    //   defaultValue: colors.nomusBlue,
    // },
    // textColor: {
    //   type: CustomizableFieldType.Color,
    //   label: 'Text color',
    //   defaultValue: colors.midnightGray,
    // },
  } as const,
  async renderFront(
    this: CardTemplate<VeliaContactFields, VeliaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: UserSpecifiedOptions<VeliaContactFields, VeliaExtendedColors>,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const placeholderTextColor = lighten(0.4)(options.colorScheme.text)

    // Draw the background
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorScheme.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Draw the bottom accent bar
    ctx.fillStyle =
      options.colorScheme.accent ??
      this.colorScheme.accent.defaultValue ??
      // Should never have go this far
      '#000000'
    ctx.fillRect(
      0,
      this.proportionalize(128),
      this.proportionalizedWidth,
      this.proportionalize(16),
    )

    // Render the name
    ctx.font = this.proportionalize(14) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.text
      : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.contactInfo.name || this.contactInfo.name.placeholder || '[name]',
      this.proportionalize(20 + 14),
    )

    // Render the headline
    ctx.font = this.proportionalize(8) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      options.contactInfo.headline ||
        this.contactInfo.headline.placeholder ||
        '[headline]',
      this.proportionalize(40 + 8),
    )

    // Render the 3 contact info lines, all 8px left from center
    const rightEdgeForLines =
      this.proportionalizedWidth / 2 - this.proportionalize(8)
    ctx.font = this.proportionalize(7) + 'px Rubik'

    ctx.fillStyle = options.contactInfo.line1
      ? options.colorScheme.text
      : placeholderTextColor
    const line1Text =
      options.contactInfo.line1 || this.contactInfo.line1.placeholder || ''
    const line1TextMetrics = ctx.measureText(line1Text)
    const line1TextX = rightEdgeForLines - line1TextMetrics.width
    ctx.fillText(line1Text, line1TextX, this.proportionalize(65 + 7))

    ctx.fillStyle = options.contactInfo.line2
      ? options.colorScheme.text
      : placeholderTextColor
    const line2Text =
      options.contactInfo.line2 || this.contactInfo.line2.placeholder || ''
    const line2TextMetrics = ctx.measureText(line2Text)
    const line2TextX = rightEdgeForLines - line2TextMetrics.width
    ctx.fillText(line2Text, line2TextX, this.proportionalize(77 + 7))

    ctx.fillStyle = options.contactInfo.line3
      ? options.colorScheme.text
      : placeholderTextColor
    const line3Text =
      options.contactInfo.line3 || this.contactInfo.line3.placeholder || ''
    const line3TextMetrics = ctx.measureText(line3Text)
    const line3TextX = rightEdgeForLines - line3TextMetrics.width
    ctx.fillText(line3Text, line3TextX, this.proportionalize(89 + 7))

    // Render the footer
    const footerText =
      options.contactInfo.footer || this.contactInfo.footer.placeholder || ''
    ctx.font = this.proportionalize(7) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.footer
      ? options.colorScheme.text
      : placeholderTextColor
    this.drawTextHorizontallyCenteredAtY(
      ctx,
      footerText,
      this.proportionalize(108),
    )

    // Render QR code
    await this.drawQRCode(
      ctx,
      // TODO: Figure out how to wire QR code URL through without it being a user-specified option
      // options.qrUrl ||
      this.contactInfo.name.placeholder || 'https://nomus.me',
      {
        x: this.proportionalize(134),
        y: this.proportionalize(65),
        width: this.proportionalize(32),
        height: this.proportionalize(32),
        backgroundColor: options.colorScheme.background,
        foregroundColor: options.colorScheme.accent,
      },
    )

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(70),
      size: this.proportionalize(11),
      color: options.colorScheme.accent,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(170),
      y: this.proportionalize(85),
      size: this.proportionalize(11),
      color: options.colorScheme.accent,
    })
  },
  async renderBack(
    this: CardTemplate<VeliaContactFields, VeliaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: UserSpecifiedOptions<VeliaContactFields, VeliaExtendedColors>,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    const ACCENT_BAR_SIZE = 16

    // Draw the main background with accent color
    ctx.fillStyle =
      options.colorScheme.accent ??
      this.colorScheme.accent.defaultValue ??
      // Should never have go this far
      '#000000'
    ctx.fillRect(
      0,
      0,
      this.proportionalizedWidth,
      this.proportionalize(this.height - ACCENT_BAR_SIZE),
    )

    // Draw the bottom bar with background color
    ctx.fillStyle =
      options.colorScheme.background ??
      this.contactInfo.name.defaultValue ??
      // Should never have go this far
      '#ffffff'
    ctx.fillRect(
      0,
      this.proportionalizedHeight - 100,
      this.proportionalizedWidth,
      1000,
    )

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageHeight =
        (options.graphic.size ?? 1) * this.proportionalize(100)
      const imageWidth =
        (imageHeight * logoImg.naturalWidth) / logoImg.naturalHeight

      // y + imageHeight + y + ACCENT_BAR_SIZE = this.usableHeight
      // y = (this.usableHeight - ACCENT_BAR_SIZE - imageHeight) / 2
      const imageY =
        (this.proportionalizedHeight - ACCENT_BAR_SIZE - imageHeight) / 2
      const imageX = (this.proportionalizedWidth - imageWidth) / 2
      ctx.drawImage(logoImg, imageX, imageY, imageWidth, imageHeight)
    }
  },
})

export default Velia
