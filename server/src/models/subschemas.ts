import { ObjectType, Field, InputType } from 'type-graphql'
import { prop } from '@typegoose/typegoose'

@ObjectType()
export class PersonName {
  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  first: string

  @prop({ required: false })
  @Field({ nullable: true })
  middle?: string

  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  last: string
}

// A dictionary of flags to indicate whether the user has already seen/encountered UI scenarios
interface IUserCheckpoints {
  expressedInterestInOrderingNomusCard: boolean
}
@ObjectType()
export class UserCheckpoints implements IUserCheckpoints {
  @prop({ default: false })
  @Field()
  expressedInterestInOrderingNomusCard: boolean
}

type UserCheckpointKey = keyof Required<IUserCheckpoints>
export const USER_CHECKPOINT_KEYS: Array<UserCheckpointKey> = [
  'expressedInterestInOrderingNomusCard',
]

export const isValidUserCheckpointKey = (s: string): s is UserCheckpointKey => {
  return (USER_CHECKPOINT_KEYS as string[]).includes(s)
}

@InputType('AddressInput')
@ObjectType('AddressObject')
export class Address {
  @prop()
  @Field({ nullable: false })
  line1: string

  @prop()
  @Field({ nullable: true })
  line2?: string

  @prop()
  @Field({ nullable: false })
  city: string

  @prop()
  @Field({ nullable: false })
  state: string

  @prop()
  @Field({ nullable: false })
  postalCode: string
}
