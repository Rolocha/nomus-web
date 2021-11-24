import { lighten } from 'polished'
import { colors } from 'src/styles'
import logoFullBlack from 'src/images/logo-full-black.svg'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'
import Link from 'src/components/Link'

const KonaTall = new CardTemplate({
  name: 'Kona Tall',
  description: [
    <>
      Don't want information overload? The Kona is perfect for someone who wants
      to keep networking simple and to-the-point.
    </>,
    <>
      If horizontal cards are more your style, check out Kona Tall's sibling,{' '}
      <Link to="/shop/product/template-card-konawide">Kona Wide</Link>.
    </>,
  ],
  width: 154,
  height: 264,
  demoImageUrl:
    'https://nomus-assets.s3.amazonaws.com/site-assets/templates/konatall.svg',
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
    ctx.font = 'bold ' + this.proportionalize(18) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.text
      : placeholderTextColor
    ctx.textAlign = 'left'
    const { height: nameHeight } = this.wrapText(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      {
        anchorTo: 'top',
        x: this.proportionalize(17),
        y: this.proportionalize(40),
        maxWidth: this.proportionalize(120),
        lineHeight: this.proportionalize(22),
      },
    )

    // Render the headline
    ctx.font = this.proportionalize(9) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    ctx.textAlign = 'left'
    this.wrapText(
      ctx,
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      {
        anchorTo: 'top',
        x: this.proportionalize(17),
        y: nameHeight + this.proportionalize(36),
        maxWidth: this.proportionalize(120),
        lineHeight: this.proportionalize(12),
      },
    )

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(104),
      y: this.proportionalize(214),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.text,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(73),
      y: this.proportionalize(234),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(89),
      y: this.proportionalize(234),
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
        maxWidth: this.proportionalize(120),
        maxHeight: this.proportionalize(228),
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

export default KonaTall
