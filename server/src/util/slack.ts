import axios from 'axios'
import { SLACK_BOT_TOKEN } from 'src/config'
import { Order } from 'src/models'

export enum slackChannel {
  Orders = 'C02598Y499U',
}

export const postNewOrder = async (channel: string, order: Order) => {
  const url = 'https://slack.com/api/chat.postMessage'
  const res = await axios.post(
    url,
    {
      channel: channel,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Order *${order.id}* in state *${order.state}*`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Amount: *\n$${[
                order.price.total.toString().slice(0, order.price.total.toString().length - 2),
                '.',
                order.price.total.toString().slice(order.price.total.toString().length - 2),
              ].join('')}`,
            },
            { type: 'mrkdwn', text: `*Short ID: *\n${order.shortId}` },
          ],
        },
        {
          type: 'section',
          fields: [{ type: 'mrkdwn', text: `*Shipping Address: *\n${order.shippingAddress}` }],
        },
      ],
    },
    { headers: { authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  )
  return res
}
