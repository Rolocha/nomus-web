import axios from 'axios'
import { SLACK_BOT_TOKEN } from 'src/config'
import { CardVersion, Order, User } from 'src/models'
import { formatDollarAmount } from 'src/util/money'

export enum SlackChannel {
  Orders = 'C02598Y499U',
}

export const postNewOrder = async (channel: string, order: Order) => {
  order = await Order.mongo.findById(order.id).populate('cardVersion').populate('user')
  return await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel: channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Order ${order.id} in state ${order.state}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Amount: *\n${formatDollarAmount(order.price.total)}`,
            },
            { type: 'mrkdwn', text: `*Short ID: *\n${order.shortId}` },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Shipping Address:*
Line 1: ${order.shippingAddress.line1}
Line 2: ${order.shippingAddress.line2}
City: ${order.shippingAddress.city}
State: ${order.shippingAddress.state}
Postal Code: ${order.shippingAddress.postalCode}`,
            },
            {
              type: 'mrkdwn',
              text: `*Name*:\n${(order.user as User).name.first} ${
                (order.user as User).name.middle ? (order.user as User).name.middle : ''
              } ${(order.user as User).name.last}\n 
*Quantity*:\n${order.quantity}`,
            },
          ],
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: 'Card Front',
            emoji: true,
          },
          // eslint-disable-next-line camelcase
          image_url: `${(order.cardVersion as CardVersion).frontImageUrl}`,
          // eslint-disable-next-line camelcase
          alt_text: 'Card Front',
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: 'Card Back',
            emoji: true,
          },
          // eslint-disable-next-line camelcase
          image_url: `${(order.cardVersion as CardVersion).backImageUrl}`,
          // eslint-disable-next-line camelcase
          alt_text: 'Card Back',
        },
      ],
    },
    { headers: { authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  )
}
