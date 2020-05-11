import colors from './colors'

const fontFamilies = {
  lato: 'Lato, Helvetica, sans-serif',
  rubik: 'Rubik, Helvetica, sans-serif',
}

export interface TextStyle {
  fontWeight?: 400 | 700 | 'medium'
  fontSize?: number | number[]
  lineHeight?: string | string[]
  fontFamily?: string
  color?: string
}

const textStyles: {
  [key: string]: TextStyle
} = {
  heading: {
    fontWeight: 400,
    fontSize: [28, 32, 52, 44],
    lineHeight: ['32px', '36px', '56px', '48px'],
    fontFamily: fontFamilies.lato,
    color: colors.textGray,
  },
  pageHeader: {
    fontWeight: 400,
    fontSize: [28, 32, 36, 36],
    lineHeight: '1.35',
    fontFamily: fontFamilies.rubik,
    color: colors.textGray,
  },
  sectionHeader: {
    fontWeight: 400,
    fontSize: [18, 20, 26, 36],
    lineHeight: '1.35',
    fontFamily: fontFamilies.rubik,
    color: colors.textGray,
  },
  sectionSubheader: {
    fontWeight: 'medium',
    fontSize: [14, 16, 18, 20],
    lineHeight: '1.35',
    fontFamily: fontFamilies.rubik,
    color: colors.textGray,
  },
  body: {
    fontSize: [15, 16, 18, 20],
    lineHeight: ['20px', '22px', '24px', '27px'],
    fontFamily: fontFamilies.rubik,
    fontWeight: 400,
    color: colors.textGray,
  },
  link: {
    fontSize: [15, 16, 18, 20],
    lineHeight: ['20px', '22px', '24px', '27px'],
    fontFamily: fontFamilies.rubik,
    fontWeight: 'medium',
    color: colors.bostonBlue,
  },
  caption: {
    fontSize: [15, 16, 18, 24],
    lineHeight: ['20px', '22px', '24px', '32px'],
    fontFamily: fontFamilies.lato,
    fontWeight: 700,
    color: colors.textGray,
  },
  label: {
    fontSize: [14, 14, 14, 14],
    lineHeight: '1.35',
    fontFamily: fontFamilies.rubik,
    fontWeight: 700,
    color: colors.primaryOlive,
  },
  input: {
    fontSize: [15, 16, 18, 24],
    lineHeight: ['20px', '22px', '24px', '32px'],
    fontFamily: fontFamilies.rubik,
    fontWeight: 400,
    color: colors.textGray,
  },
}

export default {
  fontFamilies,
  textStyles,
}
