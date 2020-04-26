import crypto from 'crypto'
import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import User from './User'
import { UUIDScalar, UUIDType } from './scalars'
import { refreshTokenLifespanInMilliseconds } from 'src/config'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Token {
  static mongo: ReturnModelType<typeof Token>

  @prop({ required: true, default: () => MUUID.v4() })
  @Field((type) => UUIDScalar)
  readonly _id: UUIDType

  @prop({ required: true, ref: 'User', get: MUUID.from, set: MUUID.from })
  @Field(() => User, { nullable: false })
  client: UUIDType

  @prop({ default: () => crypto.randomBytes(40).toString('hex') })
  @Field()
  value: string

  @prop({ default: () => Date.now() + refreshTokenLifespanInMilliseconds })
  @Field()
  expiresAt: number
  // Token expiration UNIX timestamp

  @prop({ default: false })
  @Field()
  forceInvalidated: boolean

  public isValid(): boolean {
    return this.expiresAt > Date.now() && !this.forceInvalidated
  }
}

// Attach the mongoose model onto the core model itself
Token.mongo = getModelForClass(Token)

export default Token
