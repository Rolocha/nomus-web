import { BASE_URL, DEPLOY_ENV } from 'src/config'
import { NomusProAccessInfo } from 'src/graphql/resolvers/subtypes'
import { IApolloContext } from 'src/graphql/types'
import { NomusProSubscription } from 'src/models'
import { NomusProFeatureSet } from 'src/models/subschemas'
import { BillableProduct, NomusProFeature, Role } from 'src/util/enums'
import { stripe } from 'src/util/stripe'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'

const NOMUS_PRO_TESTMODE_PRICE_ID = 'price_1JJCjUGTbyReVwroiTSi5NBz'
const NOMUS_PRO_LIVEMODE_PRICE_ID = 'price_1J2pmAGTbyReVwroC8Dmk9c5'
export const NOMUS_PRO_PRICE_ID =
  DEPLOY_ENV === 'production' ? NOMUS_PRO_LIVEMODE_PRICE_ID : NOMUS_PRO_TESTMODE_PRICE_ID

@InputType()
class UpdateNomusProFeatureSetInput implements Partial<Record<NomusProFeature, boolean | null>> {
  @Field({ nullable: true })
  [NomusProFeature.UseCustomTapLink]: boolean | null
}

@ObjectType()
class NomusProCheckoutSession {
  @Field({ nullable: false })
  url: string
}
@Resolver()
class NomusProSubscriptionResolver {
  @Authorized(Role.User)
  @Query(() => NomusProAccessInfo, { nullable: true })
  async nomusProAccessInfo(@Ctx() context: IApolloContext): Promise<NomusProAccessInfo> {
    return NomusProSubscription.mongo.getAccessInfoForUser(context.user.id)
  }

  @Authorized(Role.User)
  @Mutation(() => NomusProAccessInfo, { nullable: true })
  async updateNomusProFeatureSet(
    @Arg('featureSetUpdate', (type) => UpdateNomusProFeatureSetInput, { nullable: false })
    featureSetUpdate: UpdateNomusProFeatureSetInput,
    @Ctx() context: IApolloContext
  ): Promise<NomusProAccessInfo | null> {
    // Build out a Mongo update payload for the feature set with the nested-dot-notation
    // e.g. something like { 'featureSet.UseCustomTapLink': true, ... }
    const featureUpdateInputKeys = Object.keys(featureSetUpdate) as NomusProFeature[]
    const featureSetMongoUpdate: Partial<NomusProFeatureSet> = featureUpdateInputKeys.reduce(
      (acc, feature) => {
        // Using this strong type syntax to make sure we'll catch this if we ever rename 'featureSet'
        const dotParts: [keyof NomusProSubscription, NomusProFeature] = ['featureSet', feature]
        acc[dotParts.join('.')] = featureSetUpdate[feature]
        return acc
      },
      {}
    )

    await NomusProSubscription.mongo.updateOne(
      { user: context.user.id },
      { $set: featureSetMongoUpdate }
    )
    return this.nomusProAccessInfo(context)
  }

  @Authorized(Role.User)
  @Mutation(() => NomusProCheckoutSession, { nullable: true })
  async createNomusProCheckoutSession(
    @Arg('triggerFeature', (type) => NomusProFeature, {
      description: 'The feature the user was trying to use when prompted to subscribe to Nomus Pro',
      nullable: true,
    })
    triggerFeature: NomusProFeature | null,
    @Ctx() context: IApolloContext
  ) {
    const session = await stripe.checkout.sessions.create({
      /* eslint-disable camelcase */
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: NOMUS_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: `${BASE_URL}/dashboard/profile?session_id={CHECKOUT_SESSION_ID}&completedNomusProSubscription`,
      cancel_url: `${BASE_URL}/dashboard/profile?session_id={CHECKOUT_SESSION_ID}&canceledNomusProSubscription`,
      customer_email: context.user.email,
      metadata: {
        userId: context.user.id,
        // Store the ID of the feature which prompted the user to sign up
        // This is useful for product analytics and also lets us enable that feature when the user completes payment
        triggerFeature,
        billableProduct: BillableProduct.NomusPro,
      },
      /* eslint-enable camelcase */
    })

    return {
      // @ts-ignore
      url: session.url,
    }
  }
}
export default NomusProSubscriptionResolver
