import axios from 'axios'
import { SLACK_BOT_TOKEN } from 'src/config'
import { CardVersion, Order, User } from 'src/models'
import { formatDollarAmount } from 'src/util/money'

export enum Channel {
  Orders = 'C02598Y499U',
}

interface SlackMessage {
  channel: Channel
  blocks: any[]
}

interface SlackSimpleMarkdownMessage {
  channel: Channel
  text: string
}

export const postMessage = async ({ channel, blocks }: SlackMessage) => {
  return await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel,
      blocks,
    },
    { headers: { authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  )
}

export const postSimpleMarkdownMessage = async ({ channel, text }: SlackSimpleMarkdownMessage) => {
  return await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text,
          },
        },
      ],
    },
    { headers: { authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
  )
}

export const postNewOrder = async (order: Order) => {
  await postMessage({
    channel: Channel.Orders,
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
  })
}
