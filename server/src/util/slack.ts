import axios from 'axios'
import { SLACK_BOT_TOKEN } from 'src/config'
import { Order } from 'src/models'

export const postNewOrder = async (channel: string, order: Order) => {
  const url = 'https://slack.com/api/chat.postMessage'
  const res = await axios.post(
    url,
    {
      channel: channel,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: 'New order!' },
          fields: [
            { type: 'mrkdwn', text: '*Name*\nJohn Smith' },
            { type: 'mrkdwn', text: `*Amount*\n${order.price.total}` },
          ],
        },
      ],
    },
    // { headers: { authorization: `Bearer ${SLACK_BOT_TOKEN}` } }
    {
      headers: {
        authorization: `Bearer xoxb-1040366702640-1052240990754-KQEbKkr3lEeLKBMFVoEgpJXG`,
      },
    }
  )
  return res
}
