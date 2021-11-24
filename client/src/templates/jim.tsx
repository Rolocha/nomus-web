import { lighten } from 'polished'
import { colors } from 'src/styles'
import logoFull from 'src/images/logo-full.svg'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

const frontTriangleSVG = ({
  color = colors.viridianGreen,
}: {
  color: string
}) =>
  encodeURIComponent(`
    <svg width="69" height="50" viewBox="0 0 69 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M69 0L0 50H69V0Z" fill="${color}"/>
    </svg>
    `)

const backTriangleSVG = ({ color = colors.viridianGreen }: { color: string }) =>
  encodeURIComponent(`
  <svg width="69" height="50" viewBox="0 0 69 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0L69 50H0V0Z" fill="${color}"/>
  </svg>
    `)

const Jim = new CardTemplate({
  name: 'Jim',
  description: [
    <>
      The Jim is practical with just a tiny pop of color. All the while, it
      provides all the information you might need to network like a pro!
    </>,
  ],
  width: 264,
  height: 154,
  demoImageUrl:
    'https://nomus-assets.s3.amazonaws.com/site-assets/templates/jim.svg',
  colorScheme: {
    background: {
      defaultValue: colors.white,
    },
    accent: {
      defaultValue: colors.viridianGreen,
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
      required: false,
      placeholder: '(555)-555-5555',
    },
    line2: {
      label: 'Line 2',
      required: false,
      placeholder: 'john@appleseed.com',
    },
    line3: {
      label: 'Line 3',
      required: false,
      placeholder: '1 Apple Park Road',
    },
    footer: {
      label: 'Footer',
      required: false,
      placeholder: 'An apple a day keeps the doctor away!',
    },
  } as const,
  graphicSpec: {
    defaultGraphic: logoFull,
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
    const placeholderAccentColor = lighten(0.4)(options.colorScheme.text)

    // Background color fill
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render Front Triangle
    const svgMarkup = frontTriangleSVG({
      color: options.colorScheme.accent,
    })
    const img1 = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(
      img1,
      this.proportionalize(195),
      this.proportionalize(104),
      this.proportionalize(69),
      this.proportionalize(50),
    )

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(71),
      y: this.proportionalize(89),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.background,
      foregroundColor: options.colorScheme.text,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(55),
      y: this.proportionalize(93),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(55),
      y: this.proportionalize(109),
      size: this.proportionalize(12),
      color: options.colorScheme.text,
    })

    // Render the name
    ctx.textAlign = 'right'
    ctx.font = this.proportionalize(10) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.accent
      : placeholderAccentColor
    this.wrapText(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      {
        anchorTo: 'top',
        x: this.proportionalize(103),
        y: this.proportionalize(45),
        maxWidth: this.proportionalize(85),
        lineHeight: this.proportionalize(12),
      },
    )

    // Render the headline
    ctx.textAlign = 'left'
    ctx.font = this.proportionalize(8) + 'px Rubik'
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
        x: this.proportionalize(111),
        y: this.proportionalize(44),
        maxWidth: this.proportionalize(112),
        lineHeight: this.proportionalize(10),
      },
    )

    ctx.textAlign = 'left'
    // Render line1
    if (!options.omittedContactInfoFields.includes('line1')) {
      ctx.font = this.proportionalize(8) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line1
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.line1 ||
          this.contactInfoSpec.line1.placeholder ||
          '[line 1]',
        this.proportionalize(111),
        this.proportionalize(66),
      )
    }
    // Render line2
    if (!options.omittedContactInfoFields.includes('line2')) {
      ctx.font = this.proportionalize(8) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line2
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.line2 ||
          this.contactInfoSpec.line2.placeholder ||
          '[line 2]',
        this.proportionalize(111),
        this.proportionalize(78),
      )
    }
    // Render line3
    if (!options.omittedContactInfoFields.includes('line3')) {
      ctx.font = this.proportionalize(8) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line3
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.line3 ||
          this.contactInfoSpec.line3.placeholder ||
          '[line 3]',
        this.proportionalize(111),
        this.proportionalize(90),
      )
    }

    // Render footer
    if (!options.omittedContactInfoFields.includes('footer')) {
      ctx.font = this.proportionalize(7) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.footer
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.footer ||
          this.contactInfoSpec.footer.placeholder ||
          '[footer]',
        this.proportionalize(111),
        this.proportionalize(121),
      )
    }
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

    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render Back Triangle
    const svgMarkup = backTriangleSVG({
      color: options.colorScheme.accent,
    })
    const img1 = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(
      img1,
      this.proportionalize(0),
      this.proportionalize(104),
      this.proportionalize(69),
      this.proportionalize(50),
    )

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageDims = this.fitImageToBounds(logoImg, {
        maxWidth: this.proportionalize(192),
        maxHeight: this.proportionalize(98),
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

export default Jim
