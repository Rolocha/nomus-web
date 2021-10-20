import { OrderState } from 'src/apollo/types/globalTypes'
import { CardVersion } from './cardVersion'

export interface OrderPrice {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}

export interface Order {
  id: string
  shortId: string
  cardVersion: CardVersion
  price: OrderPrice | null
  quantity: number | null
  state: OrderState
  createdAt: Date
  trackingNumber: string | null
}

export enum UserFacingOrderState {
  Processing = 'Processing',
  OnItsWay = "On it's way",
  Complete = 'Complete',
  Canceled = 'Canceled',
}
