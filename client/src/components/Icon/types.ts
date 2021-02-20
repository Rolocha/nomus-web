import { ColorValue } from 'src/styles/colors'
import {
  LayoutProps,
  PositionProps,
  ResponsiveValue,
  SpaceProps,
  ThemeValue,
} from 'styled-system'

export type IconProps = {
  className?: string
  color?: ColorValue
} & SpaceProps &
  PositionProps &
  LayoutProps & {
    // Additional props made using system
    transform?: ResponsiveValue<ThemeValue<'transform', any>>
  }
