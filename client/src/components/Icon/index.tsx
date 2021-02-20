import { IconProps } from '@chakra-ui/icons'
import Profile from './ProfileIcon'
import Caret from './CaretIcon'
import Close from './CloseIcon'
import Menu from './MenuIcon'

const iconLibrary = {
  profile: Profile,
  caret: Caret,
  menu: Menu,
  close: Close,
} as const

export type IconName = keyof typeof iconLibrary

interface Props extends IconProps {
  of: IconName
}

export default ({ of, ...restProps }: Props) => {
  const SelectedIcon = iconLibrary[of]
  return <SelectedIcon {...restProps} />
}
