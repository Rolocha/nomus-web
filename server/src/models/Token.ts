import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import { ObjectType, Field } from 'type-graphql'

import { User } from './User'
import { Ref } from './scalars'
import { refreshTokenLifespan } from 'src/config'
import { BaseModel } from './BaseModel'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
@ObjectType()
class Token extends BaseModel({
  prefix: 'tok',
}) {
  static mongo: ReturnModelType<typeof Token>

  @prop({ required: true, ref: 'User', type: String })
  @Field(() => User, { nullable: false })
  client: Ref<User>

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

  public static async createNewTokenForUser(this: ReturnModelType<typeof Token>, user: string) {
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
    associatedUser: string
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

  public static async invalidate(
    this: ReturnModelType<typeof Token>,
    tokenIdToInvalidate: string
  ): Promise<boolean> {
    const thisTokenToInvalidate = await this.findById(tokenIdToInvalidate)
    thisTokenToInvalidate.forceInvalidated = true
    return true
  }
}

// Attach the mongoose model onto the core model itself
Token.mongo = getModelForClass(Token)

export default Token
