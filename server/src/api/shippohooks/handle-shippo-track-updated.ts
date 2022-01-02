import { Order, User } from 'src/models'
import { formatName } from 'src/util/name'
import * as Slack from 'src/util/slack'
import { DateTime } from 'luxon'

export default async (message: any) => {
  const trackUpdatedMessageData = message.data
  const shippoTransactionId = trackUpdatedMessageData.transaction
  const trackingStatus = trackUpdatedMessageData.tracking_status
  const shipmentEta = trackUpdatedMessageData.eta

  if (shippoTransactionId == null) {
    throw new Error(`Received Shippo track_updated event without a transaction ID`)
  }

  const order = await Order.mongo.findOne({ shippoTransactionId })
  const user = await User.mongo.findById(order.user)

  if (order == null) {
    throw new Error(`Couldn't find Order with shippoTransactionId: ${shippoTransactionId}`)
  }

  if (user == null) {
    throw new Error(`Couldn't find user (${user.id}) for order: ${order.id}`)
  }

  order.lastShippoTrackingStatus = trackingStatus
  order.shipmentEta = shipmentEta

  // trackingStatus.status is one of
  // - PRE_TRANSIT: The label is created but before the package is dropped off or picked up by the carrier.
  // - TRANSIT: The package has been scanned by the carrier and is in transit.
  // - DELIVERED: The package has been successfully delivered.
  // - RETURNED: The package is en route to be returned to the sender, or has been returned successfully.
  // - FAILURE: The carrier indicated that there has been an issue with the delivery. This can happen for various reasons and depends on the carrier. This status does not indicate a technical, but a delivery issue.
  // - UNKNOWN: The package has not been found via the carrier’s tracking system.
  // See https://goshippo.com/docs/tracking/#event-definitions for more details
  if (trackingStatus.status === 'TRANSIT') {
    await order.sendShippedEmailIfNeeded({
      eta: shipmentEta,
    })
  } else if (trackingStatus.status === 'DELIVERED') {
    await order.sendDeliveredEmailIfNeeded()
  }

  const actionRequired = trackingStatus.action_required
  const formattedEta = DateTime.fromISO(shipmentEta).toLocaleString(DateTime.DATETIME_MED)

  const slackMessageText = `
*${actionRequired ? '[ACTION REQUIRED] ' : ''} Order ${order.shortId} for ${formatName(
    user.name
  )} shipment tracking update:*
• Status: ${trackingStatus.status}${trackingStatus.substatus ? `(${trackingStatus.substatus})` : ''}
• ETA: ${formattedEta}
  `.trim()

  await Slack.postSimpleMarkdownMessage({ channel: Slack.Channel.Orders, text: slackMessageText })
}
