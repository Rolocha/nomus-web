import { OrderState } from 'src/apollo/types/globalTypes'
import { UserFacingOrderState } from 'src/types/order'

export const getUserFacingOrderState = (
  state: OrderState,
): UserFacingOrderState => {
  switch (state) {
    case OrderState.Initialized:
    case OrderState.Captured:
    case OrderState.Actionable:
    case OrderState.Reviewed:
    case OrderState.Creating:
    case OrderState.Created:
      return UserFacingOrderState.Processing
    case OrderState.Enroute:
      return UserFacingOrderState.OnItsWay
    case OrderState.Fulfilled:
      return UserFacingOrderState.Complete
    case OrderState.Canceled:
      return UserFacingOrderState.Canceled
  }
}
