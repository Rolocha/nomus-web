import { IconProps } from '@chakra-ui/icons'
import * as React from 'react'
import ArrowRightOIcon from './ArrowRightOIcon'
import CardsIcon from './CardsIcon'
import CaretIcon from './CaretIcon'
import CartIcon from './CartIcon'
import CheckIcon from './CheckIcon'
import CheckOIcon from './CheckOIcon'
import ChevronRightIcon from './ChevronRightIcon'
import CloseIcon from './CloseIcon'
import ContactsIcon from './ContactsIcon'
import DownloadIcon from './DownloadIcon'
import ExclamationOIcon from './ExclamationOIcon'
import ExternalLinkIcon from './ExternalLinkIcon'
import EyeIcon from './EyeIcon'
import FacebookIcon from './FacebookIcon'
import FormatTextIcon from './FormatTextIcon'
import GridIcon from './GridIcon'
import InfoOIcon from './InfoOIcon'
import InstagramIcon from './InstagramIcon'
import ListIcon from './ListIcon'
import MenuIcon from './MenuIcon'
import OptionsIcon from './OptionsIcon'
import OrdersIcon from './OrdersIcon'
import PenIcon from './PenIcon'
import PlusIcon from './PlusIcon'
import ProfileIcon from './ProfileIcon'
import RulerIcon from './RulerIcon'
import SearchIcon from './SearchIcon'
import SettingsIcon from './SettingsIcon'
import SlashOIcon from './SlashOIcon'
import StackIcon from './StackIcon'
import SwitchSidesIcon from './SwitchSidesIcon'
import SyncIcon from './SyncIcon'
import TwitterIcon from './TwitterIcon'
import UploadIcon from './UploadIcon'

const iconLibrary = {
  arrowRightO: ArrowRightOIcon,
  cards: CardsIcon,
  caret: CaretIcon,
  cart: CartIcon,
  check: CheckIcon,
  checkO: CheckOIcon,
  chevronRight: ChevronRightIcon,
  close: CloseIcon,
  contacts: ContactsIcon,
  download: DownloadIcon,
  exclamationO: ExclamationOIcon,
  externalLink: ExternalLinkIcon,
  eye: EyeIcon,
  facebook: FacebookIcon,
  formatText: FormatTextIcon,
  grid: GridIcon,
  infoO: InfoOIcon,
  instagram: InstagramIcon,
  list: ListIcon,
  menu: MenuIcon,
  options: OptionsIcon,
  orders: OrdersIcon,
  pen: PenIcon,
  plus: PlusIcon,
  profile: ProfileIcon,
  ruler: RulerIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  slashO: SlashOIcon,
  stack: StackIcon,
  switchSides: SwitchSidesIcon,
  sync: SyncIcon,
  twitter: TwitterIcon,
  upload: UploadIcon,
} as const

export type IconName = keyof typeof iconLibrary

export const iconNames = Object.keys(iconLibrary).sort() as IconName[]

interface Props extends IconProps {
  of: IconName
}

export default ({ of, ...restOfProps }: Props) => {
  const SelectedIcon = iconLibrary[of]
  return React.createElement(SelectedIcon, restOfProps)
}
