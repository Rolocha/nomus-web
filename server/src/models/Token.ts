import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import MUUID from 'uuid-mongodb'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import User from './User'
import { UUIDScalar, UUIDType } from './scalars'
import { refreshTokenLifespan } from 'src/config'

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
  // Hashed form of the token value

  @prop({ default: () => Date.now() + refreshTokenLifespan })
  @Field()
  expiresAt: number
  // Token expiration UNIX timestamp

  @prop({ default: false })
  @Field()
  forceInvalidated: boolean

  public static async createNewTokenForUser(this: ReturnModelType<typeof Token>, user: UUIDType) {
    const preHashToken = crypto.randomBytes(40).toString('hex')
    const tokenObject = await this.create({
      client: user,
      value: await bcrypt.hash(preHashToken, 10),
    })

    // The only time we return the pre-hashed token; so we can send it to the user
    return { preHashToken, tokenObject }
  }

  public isValid(): boolean {
    return this.expiresAt > Date.now() && !this.forceInvalidated
  }

  public static async verify(
    this: ReturnModelType<typeof Token>,
    proposedToken: string,
    associatedUser: UUIDType
  ): Promise<boolean> {
    try {
      const tokensForThisUser = await this.find({ client: associatedUser })
      for (const token of tokensForThisUser) {
        const tokenMatches = await bcrypt.compare(proposedToken, token.value)
        if (tokenMatches) {
          const tokenNotExpired = token.expiresAt > Date.now()
          if (tokenNotExpired && !token.forceInvalidated) {
            return true
          }
          return false
        }
      }
      return false
    } catch (err) {
      return false
    }
  }
}

// Attach the mongoose model onto the core model itself
Token.mongo = getModelForClass(Token)

export default Token
