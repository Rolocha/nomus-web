import { colors } from 'src/styles'
import CardTemplate, { CardTemplateRenderOptions } from 'src/templates/base'

export type RolochaContactFields =
  | 'name'
  | 'headline'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'line4'
  | 'footer'
export type RolochaExtendedColors = 'accentColor2' | 'accentColor3'

const primarySquiggleSVG = ({ color = colors.nomusBlue }: { color: string }) =>
  encodeURIComponent(`
<svg width="144" height="91" viewBox="0 0 144 91" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M120.586 23.139C127.559 20.064 131.332 12.718 136.059 6.774C138.167 4.12286 140.957 1.63186 144 0V91L0 90.5V76.2082C8.02631 68.1219 19.2059 62.7589 30.3771 62.092C34.8692 61.824 39.4344 62.248 43.8316 61.299C63.8413 56.981 70.5305 27.748 90.6502 23.963C100.555 22.1 111.374 27.202 120.586 23.139Z" fill="${color}"/>
</svg>
  `)

const Rolocha = new CardTemplate<RolochaContactFields, RolochaExtendedColors>({
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
    accentColor2: {
      defaultValue: colors.gold,
    },
    accentColor3: {
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
      placeholder: 'An apple a day keeps the doctor away',
    },
  } as const,
  async renderFront(
    this: CardTemplate<RolochaContactFields, RolochaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions<
      RolochaContactFields,
      RolochaExtendedColors
    >,
  ) {
    this.clearCanvas(canvas)

    const ctx = canvas.getContext('2d')
    if (ctx == null) {
      throw new Error('Got null for canvas context')
    }

    // const placeholderTextColor = lighten(0.4)(options.colorScheme.text)

    // Background color fill
    ctx.fillStyle =
      options.colorScheme.background ??
      this.colorSchemeSpec.background.defaultValue ??
      // Should never have go this far
      colors.white
    ctx.fillRect(0, 0, this.proportionalizedWidth, this.proportionalizedHeight)

    // Render Primary Squiggl
    const svgMarkup = primarySquiggleSVG({ color: options.colorScheme.accent })
    const img = await this.createImage('data:image/svg+xml,' + svgMarkup)
    ctx.drawImage(
      img,
      this.proportionalize(0),
      this.proportionalize(167),
      this.proportionalize(154),
      this.proportionalize(97),
    )
  },
  async renderBack(
    this: CardTemplate<RolochaContactFields, RolochaExtendedColors>,
    canvas: HTMLCanvasElement,
    options: CardTemplateRenderOptions<
      RolochaContactFields,
      RolochaExtendedColors
    >,
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
  },
})

export default Rolocha
