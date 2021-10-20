import { DocumentType, getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose'
import { NomusProAccessInfo } from 'src/graphql/resolvers/subtypes'
import { EMPTY_FEATURE_SET, NomusProFeatureSet } from 'src/models/subschemas'
import { Field } from 'type-graphql'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'
import { User } from './User'

export class NomusProSubscription extends BaseModel({
  prefix: 'nprosub',
}) {
  static mongo: ReturnModelType<typeof NomusProSubscription>

  @prop({ required: true, ref: 'User', type: String, index: true })
  user: Ref<User>

  @prop({ required: false })
  originalCheckoutSession: string

  @prop({ required: true, index: true, unique: true })
  stripeSubscription: string

  // Unix time (seconds)
  @prop({ required: true })
  currentPeriodStartsAt: number

  // Unix time (seconds)
  @prop({ required: true })
  currentPeriodEndsAt: number

  @prop({ _id: false, required: true, default: EMPTY_FEATURE_SET })
  @Field(() => NomusProFeatureSet, { nullable: false })
  featureSet: NomusProFeatureSet

  static async getAccessInfoForUser(
    this: ReturnModelType<typeof NomusProSubscription>,
    userId: string
  ) {
    const sub = await this.findOne({ user: userId })
    if (sub == null) {
      return null
    }
    return sub.getAccessInfo()
  }

  isActive(this: DocumentType<NomusProSubscription>): boolean {
    return (
      this.currentPeriodEndsAt &&
      new Date(this.currentPeriodEndsAt * 1000).getTime() > new Date().getTime()
    )
  }

  getAccessInfo(this: DocumentType<NomusProSubscription>): NomusProAccessInfo {
    return {
      id: this.id,
      hasAccessUntil: this.currentPeriodEndsAt,
      featureSet: this.featureSet,
    }
  }
}

// Attach the mongoose model onto the core model itself
export const NomusProSubscriptionModel = getModelForClass(NomusProSubscription)
NomusProSubscription.mongo = NomusProSubscriptionModel

export default NomusProSubscription
