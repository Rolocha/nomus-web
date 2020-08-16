import { stripe } from 'src/util/stripe'
import { Resolver, Field, Mutation, Arg, Ctx, InputType } from 'type-graphql'
import { IApolloContext } from '../types'

@InputType()
class CreatePaymentIntentInput {
  @Field()
  amount: number
}

@Resolver()
class PaymentIntentResolver {
  @Mutation()
  async createPaymentIntent(
    @Arg('payload', { nullable: true }) payload: CreatePaymentIntentInput,
    @Ctx() context: IApolloContext
  ) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payload.amount,
      currency: 'usd', // We'll know we made it when we can change this line :')
    })
    return
  }
}
