import { OrderCancelationState, OrderState } from 'src/apollo/types/globalTypes'
import { Order, UserFacingOrderState } from 'src/types/order'

export const getUserFacingOrderState = (order: Order): UserFacingOrderState => {
  if (order.cancelationState === OrderCancelationState.Canceled)
    return UserFacingOrderState.Canceled

  switch (order.state) {
    case OrderState.Captured:
    case OrderState.Paid:
    case OrderState.Creating:
    case OrderState.Created:
      return UserFacingOrderState.Processing
    case OrderState.Enroute:
      return UserFacingOrderState.OnItsWay
    case OrderState.Fulfilled:
      return UserFacingOrderState.Complete
  }
}
