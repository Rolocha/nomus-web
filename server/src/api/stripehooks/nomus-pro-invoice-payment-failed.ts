import { BASE_URL } from 'src/config'
import { User, NomusProSubscription } from 'src/models'
import { SendgridTemplate, sgMail } from 'src/util/sendgrid'
import { Stripe, stripe } from 'src/util/stripe'

export default async (event: any) => {
  const invoice = event.data.object as Stripe.Invoice
  // Webhook-originated events never have expandable properties expanded so we can be sure it's a string
  // See https://stripe.com/docs/expand#with-webhooks for more details
  const stripeSubscriptionId = invoice.subscription as string

  if (!stripeSubscriptionId) {
    throw new Error(
      'Received a Nomus Pro invoice paid webhook with an empty `subscription` property'
    )
  }

  const nomusProSubscription = await NomusProSubscription.mongo
    .findOne({ stripeSubscription: stripeSubscriptionId })
    .populate('user')
  const user = nomusProSubscription.user as User

  const latestCharge = await stripe.charges.retrieve(invoice.charge as string)

  const checkoutPortalSession = await stripe.billingPortal.sessions.create({
    /* eslint-disable camelcase */
    customer: invoice.customer as string,
    return_url: `${BASE_URL}/dashboard`,
    /* eslint-enable camelcase */
  })

  // Send the user an email saying that their payment failed.
  await sgMail.send({
    to: user.email,
    from: 'hi@nomus.me',
    templateId: SendgridTemplate.NomusProPaymentFailed,
    dynamicTemplateData: {
      firstName: user.name.first,
      chargeAmount: invoice.total,
      cardLast4: latestCharge.payment_method_details.card.last4,
      checkoutPortalLink: checkoutPortalSession.url,
    },
  })
}
