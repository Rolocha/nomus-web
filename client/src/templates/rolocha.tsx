import { lighten } from 'polished'
import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

const primarySquiggleFrontSVG = ({
  color = colors.nomusBlue,
}: {
  color: string
}) =>
  encodeURIComponent(`
<svg width="144" height="91" viewBox="0 0 144 91" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M120.586 23.139C127.559 20.064 131.332 12.718 136.059 6.774C138.167 4.12286 140.957 1.63186 144 0V91L0 90.5V76.2082C8.02631 68.1219 19.2059 62.7589 30.3771 62.092C34.8692 61.824 39.4344 62.248 43.8316 61.299C63.8413 56.981 70.5305 27.748 90.6502 23.963C100.555 22.1 111.374 27.202 120.586 23.139Z" fill="${color}"/>
</svg>
  `)

const primarySquiggleBackSVG = ({
  color = colors.nomusBlue,
}: {
  color: string
}) =>
  encodeURIComponent(`
<svg width="144" height="159" viewBox="0 0 144 159" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.7677 4.28631C9.7864 1.5087 3 9.15527e-05 -5 9.15527e-05V165H149V131.9C145.113 127.393 132.04 123.343 126.943 121.693C116.25 118.23 104.205 114.177 99.4587 104.12C97.2699 99.4829 97.0251 94.2287 96.3312 89.1609C94.2976 74.3102 86.7702 58.7915 72.6727 53.1705C68.0401 51.3241 61.9485 49.195 56.9768 48.6956C52.26 48.2222 48.3435 50.3179 43.6489 47.6746C37.8068 44.3847 27.8282 19.6336 23.8756 14.6398C20.8756 10.8495 17.7489 7.06392 13.7677 4.28631Z" fill="${color}"/>
</svg>  
  `)

const secondarySquiggleFrontSVG = ({
  color = colors.gold,
}: {
  color: string
}) =>
  encodeURIComponent(`
<svg width="144" height="108" viewBox="0 0 144 108" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.095 27.6822C17.123 24.0585 13.35 15.3998 8.623 8.39464C6.35803 5.03807 3.30625 1.89946 0 0V108H144V89.4386C136.029 80.3495 125.161 74.3551 114.301 73.591C109.809 73.2745 105.244 73.7748 100.847 72.6567C80.838 67.5673 74.149 33.1141 54.03 28.6537C44.126 26.4576 33.307 32.4702 24.095 27.6822Z" fill="${color}"/>
</svg>  
  `)

const secondarySquiggleBackSVG = ({ color = colors.gold }: { color: string }) =>
  encodeURIComponent(`
<svg width="144" height="246" viewBox="0 0 144 246" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M129.664 20.6015C132.665 14.6863 135.791 8.77747 139.772 4.44239C141.092 3.00605 145.5 6.10352e-05 149 6.10352e-05V252H-5C-4.259 242.119 -0.479002 221.266 1.98793 212.161C5.58483 198.888 18.5326 191.763 26.5968 187.688C37.2905 182.283 49.335 175.958 54.0813 160.261C56.2702 153.024 56.515 144.823 57.2089 136.913C58.4285 123.018 61.2317 108.431 67.873 95.9677C75.0678 82.4656 88.4012 78.052 100.767 69.7069C103.289 68.0058 105.785 66.2529 108.059 64.2424C120.977 52.8237 122.302 35.1186 129.664 20.6015Z" fill="${color}"/>
</svg>  
  `)

const rectangleBackSVG = ({ color = colors.nomusBlue }: { color: string }) =>
  encodeURIComponent(`
<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect y="6.10352e-05" width="80" height="80" rx="8" fill="${color}"/>
</svg>
  `)

const Rolocha = new CardTemplate({
  name: 'Rolocha',
  width: 154,
  height: 264,
  demoImageUrl:
    'https://user-images.githubusercontent.com/10100874/118752012-30f42f80-b817-11eb-986f-1fefcbfd8044.png',
  colorScheme: {
    background: {
      defaultValue: colors.white,
    },
    accent: {
      defaultValue: colors.nomusBlue,
    },
    accent2: {
      defaultValue: colors.gold,
    },
    accent3: {
      defaultValue: colors.brightCoral,
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
      placeholder: 'Apple Seed, LLC',
    },
    line4: {
      label: 'Line 4',
      required: false,
      placeholder: '1 Apple Park Road',
    },
    footer: {
      label: 'Footer',
      required: false,
      placeholder: 'Apple a day!',
    },
  } as const,
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

    // Background color fill
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render Secondary Squiggle
    // Has to be rendered first be underneath primary squiggle
    const svgMarkup2 = secondarySquiggleFrontSVG({
      color: options.colorScheme.accent2,
    })
    const img2 = await this.createImage('data:image/svg+xml,' + svgMarkup2)
    ctx.drawImage(
      img2,
      this.proportionalize(0),
      this.proportionalize(149),
      this.proportionalize(154),
      this.proportionalize(115),
    )

    // Render Primary Squiggle
    const svgMarkup = primarySquiggleFrontSVG({
      color: options.colorScheme.accent,
    })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(
      img,
      this.proportionalize(0),
      this.proportionalize(167),
      this.proportionalize(154),
      this.proportionalize(97),
    )

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(89),
      y: this.proportionalize(214),
      width: this.proportionalize(32),
      height: this.proportionalize(32),
      backgroundColor: options.colorScheme.accent,
      foregroundColor: options.colorScheme.background,
    })

    // Render Nomus logo
    await this.drawNomusLogo(ctx, {
      x: this.proportionalize(125),
      y: this.proportionalize(218),
      size: this.proportionalize(12),
      color: options.colorScheme.background,
    })

    // Render NFC tap icon
    await this.drawNFCTapIcon(ctx, {
      x: this.proportionalize(125),
      y: this.proportionalize(234),
      size: this.proportionalize(12),
      color: options.colorScheme.background,
    })

    // Render the name
    ctx.font = this.proportionalize(14) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.name
      ? options.colorScheme.accent
      : placeholderTextColor
    this.wrapTextAnchorBottomLeft(
      ctx,
      options.contactInfo.name ||
        this.contactInfoSpec.name.placeholder ||
        '[name]',
      this.proportionalize(21),
      this.proportionalize(48),
      this.proportionalize(112),
      this.proportionalize(14),
    )

    // Render the headline
    ctx.font = this.proportionalize(9) + 'px Rubik'
    ctx.fillStyle = options.contactInfo.headline
      ? options.colorScheme.text
      : placeholderTextColor
    this.wrapTextAnchorTopLeft(
      ctx,
      options.contactInfo.headline ||
        this.contactInfoSpec.headline.placeholder ||
        '[headline]',
      this.proportionalize(21),
      this.proportionalize(60),
      this.proportionalize(112),
      this.proportionalize(9),
    )

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
        this.proportionalize(21),
        this.proportionalize(95),
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
        this.proportionalize(21),
        this.proportionalize(108),
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
        this.proportionalize(21),
        this.proportionalize(121),
      )
    }
    // Render line4
    if (!options.omittedContactInfoFields.includes('line4')) {
      ctx.font = this.proportionalize(8) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.line4
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.line4 ||
          this.contactInfoSpec.line4.placeholder ||
          '[line 4]',
        this.proportionalize(21),
        this.proportionalize(134),
      )
    }
    // Render footer
    if (!options.omittedContactInfoFields.includes('footer')) {
      ctx.font = this.proportionalize(8) + 'px Rubik'
      ctx.fillStyle = options.contactInfo.footer
        ? options.colorScheme.text
        : placeholderTextColor
      ctx.fillText(
        options.contactInfo.footer ||
          this.contactInfoSpec.footer.placeholder ||
          '[footer]',
        this.proportionalize(21),
        this.proportionalize(147),
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
      options.colorScheme.accent3 ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render Secondary Squiggle
    const svgMarkup = secondarySquiggleBackSVG({
      color: options.colorScheme.accent2,
    })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(
      img,
      this.proportionalize(0),
      this.proportionalize(12),
      this.proportionalize(154),
      this.proportionalize(252),
    )

    // Render Primary Squiggle
    const svgMarkup2 = primarySquiggleBackSVG({
      color: options.colorScheme.accent,
    })
    const img2 = await this.createImage('data:image/svg+xml,' + svgMarkup2)
    ctx.drawImage(
      img2,
      this.proportionalize(0),
      this.proportionalize(99),
      this.proportionalize(154),
      this.proportionalize(165),
    )

    // Render QR Background
    const svgMarkup3 = rectangleBackSVG({
      color: options.colorScheme.accent,
    })
    const img3 = await this.createImage('data:image/svg+xml,' + svgMarkup3)
    ctx.drawImage(
      img3,
      this.proportionalize(37),
      this.proportionalize(92),
      this.proportionalize(80),
      this.proportionalize(80),
    )

    // Render QR code
    await this.drawQRCode(ctx, options.qrCodeUrl || 'https://nomus.me', {
      x: this.proportionalize(45),
      y: this.proportionalize(100),
      width: this.proportionalize(64),
      height: this.proportionalize(64),
      backgroundColor: options.colorScheme.accent,
      foregroundColor: options.colorScheme.background,
    })

    // Render user-provided logo if provided
    if (options.graphic?.url) {
      const logoImg = await this.createImage(options.graphic.url)
      const imageHeight =
        (options.graphic.size ?? 1) * this.proportionalize(100)
      const imageWidth =
        (imageHeight * logoImg.naturalWidth) / logoImg.naturalHeight
      ctx.drawImage(
        logoImg,
        this.proportionalize(45),
        this.proportionalize(172),
        imageWidth,
        imageHeight,
      )
    }
  },
})

export default Rolocha
