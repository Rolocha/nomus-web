import { OrderState } from 'src/apollo/types/globalTypes'

export interface Order {
  id: string
  cardVersion: any
  price: number
  quantity: number
  state: OrderState
  createdAt: Date
  trackingNumber: string
}
