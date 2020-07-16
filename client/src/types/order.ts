import { OrderState } from 'src/apollo/types/globalTypes'
import { CardVersion } from './cardVersion'

export interface Order {
  id: string
  orderNumber: string
  cardVersion: CardVersion
  price: number
  quantity: number
  state: OrderState
  createdAt: Date
  trackingNumber: string | null
}
