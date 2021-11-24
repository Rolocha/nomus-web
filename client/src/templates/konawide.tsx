import { lighten } from 'polished'
import { colors } from 'src/styles'
import logoFullBlack from 'src/images/logo-full-black.svg'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'
import Link from 'src/components/Link'

const KonaWide = new CardTemplate({
  name: 'Kona Wide',
  description: [
    <>
      Don't want information overload? The Kona is perfect for someone who wants
      to keep networking simple and to-the-point.
    </>,
    <>
      If vertical cards are more your style, check out Kona Wide's sibling,{' '}
      <Link to="/shop/product/template-card-konatall">Kona Tall</Link>.
    </>,
  ],
  width: 264,
  height: 154,
  demoImageUrl:
    'https://nomus-assets.s3.amazonaws.com/site-assets/templates/konawide.svg',
  colorScheme: {
    background: {
      defaultValue: colors.white,
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
  } as const,
  graphicSpec: {
    defaultGraphic: logoFullBlack,
  },
  async renderFront(
    this: CardTemplate,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
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
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render the name
    ctx.font = 'bold ' + this.proportionalize(24) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.text
      : placeholderTextColor
    const { height: nameHeight } = this.wrapText(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      {
        anchorTo: 'top',
        x: this.proportionalize(18),
        y: this.proportionalize(41),
        maxWidth: this.proportionalize(228),
        lineHeight: this.proportionalize(28),
      },
    )

    // Render the headline
    ctx.font = this.proportionalize(10) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    this.wrapText(
      ctx,
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      {
        anchorTo: 'top',
        x: this.proportionalize(18),
        y: nameHeight + this.proportionalize(30),
        maxWidth: this.proportionalize(228),
        lineHeight: this.proportionalize(10),
      },
    )

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(208),
      y: this.proportionalize(99),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.text,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(176),
      y: this.proportionalize(119),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(192),
      y: this.proportionalize(119),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })
  },
  async renderBack(
    this: CardTemplate,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    // Draw the background
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageDims = this.fitImageToBounds(logoImg, {
        maxWidth: this.proportionalize(228),
        maxHeight: this.proportionalize(120),
      })
      const scale = options.graphic.size ?? 1
      const imageWidth = imageDims.width * scale
      const imageHeight = imageDims.height * scale

      const imageY = (this.proportionalizedHeight - imageHeight) / 2
      const imageX = (this.proportionalizedWidth - imageWidth) / 2
      ctx.drawImage(logoImg, imageX, imageY, imageWidth, imageHeight)
    }
  },
})

export default KonaWide
