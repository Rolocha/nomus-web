import * as React from 'react'
import { gql, useQuery } from 'src/apollo'
import { OrderState } from 'src/apollo/types/globalTypes'
import { UCPOrdersSectionQuery } from 'src/apollo/types/UCPOrdersSectionQuery'
import Box from 'src/components/Box'
import * as Text from 'src/components/Text'
import LoadingPage from 'src/pages/LoadingPage'
import OrderList from './OrderList'

const bp = 'md'

export default () => {
  const { loading, data } = useQuery<UCPOrdersSectionQuery>(
    gql`
      query UCPOrdersSectionQuery {
        orders {
          id
          cardVersion {
            frontImageUrl
            backImageUrl
          }
          price
          quantity
          state
          createdAt
          trackingNumber
        }
      }
    `,
  )

  if (loading || !data) {
    return <LoadingPage />
  }

  const orders = [
    {
      id: '1',
      state: OrderState.Created,
      price: 2500,
      quantity: 50,
      createdAt: new Date('2020-05-20T04:06:25.850Z'),
      trackingNumber: '123456789101112',
      cardVersion: '',
    },
    {
      id: '2',
      state: OrderState.Enroute,
      price: 2500,
      quantity: 50,
      createdAt: new Date('2020-05-20T04:06:25.850Z'),
      trackingNumber: '123456789101112',
      cardVersion: '',
    },
    {
      id: '3',
      state: OrderState.Fulfilled,
      price: 2500,
      quantity: 50,
      createdAt: new Date('2020-05-20T04:06:25.850Z'),
      trackingNumber: '123456789101112',
      cardVersion: '',
    },
    {
      id: '4',
      state: OrderState.Fulfilled,
      price: 2500,
      quantity: 50,
      createdAt: new Date('2020-05-20T04:06:25.850Z'),
      trackingNumber: '123456789101112',
      cardVersion: '',
    },
  ]

  const currentOrders = orders.filter(
    (order) => order.state !== OrderState.Fulfilled,
  )
  const previousOrders = orders.filter(
    (order) => order.state === OrderState.Fulfilled,
  )

  return (
    <Box>
      <Text.H3 mb={2}>Current orders</Text.H3>
      <OrderList orders={currentOrders} />

      <Text.H3 mt={4}>Previous orders</Text.H3>
      <OrderList orders={previousOrders} />
    </Box>
  )
}
