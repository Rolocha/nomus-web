import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
  DocumentType,
} from '@typegoose/typegoose'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { PASSWORD_RESET_TOKEN_LIFESPAN } from 'src/config'
import { BaseModel } from './BaseModel'
import { Ref } from './scalars'
import { User } from './User'

@modelOptions({ schemaOptions: { timestamps: true, usePushEach: true } })
export class PasswordResetToken extends BaseModel({
  prefix: 'pwrst',
}) {
  static mongo: ReturnModelType<typeof PasswordResetToken>

  @prop({ required: true, ref: 'User', type: String })
  user: Ref<User>

  @prop({ required: true, default: () => crypto.randomBytes(20).toString('hex') })
  value: string | null

  @prop({ required: false, default: () => Date.now() + PASSWORD_RESET_TOKEN_LIFESPAN })
  expiresAtMs: number // ms since epoch

  @prop({ default: false })
  forceInvalidated: boolean

  public static async createNewTokenForUser(
    this: ReturnModelType<typeof PasswordResetToken>,
    user: string
  ) {
    const preHashToken = crypto.randomBytes(40).toString('hex')
    const tokenObject = await this.create({
      user,
      value: await bcrypt.hash(preHashToken, 10),
    })

    // The only time we return the pre-hashed token; so we can send it to the user
    return { preHashToken, tokenObject }
  }

  public isValid(): boolean {
    return this.expiresAtMs > Date.now() && !this.forceInvalidated
  }

  public static async verify(
    this: ReturnModelType<typeof PasswordResetToken>,
    proposedToken: string,
    associatedUser: string
  ): Promise<'success' | 'expired' | 'invalid'> {
    try {
      const tokensForThisUser = await this.find({ user: associatedUser })
      for (const token of tokensForThisUser) {
        const tokenMatches = await bcrypt.compare(proposedToken, token.value)
        if (tokenMatches) {
          return token.expiresAtMs > Date.now() ? 'success' : 'expired'
        }
      }
      return 'invalid'
    } catch (err) {
      return 'invalid'
    }
  }

  public static async invalidateAllForUser(
    this: ReturnModelType<typeof PasswordResetToken>,
    userId: string
  ): Promise<void> {
    const tokensToInvalidate = await this.find({ user: userId })
    await Promise.all(tokensToInvalidate.map((token) => token.invalidate()))
  }

  public async invalidate(this: DocumentType<PasswordResetToken>) {
    this.forceInvalidated = true
    return this.save()
  }
}

// Attach the mongoose model onto the core model itself
export const PasswordResetTokenModel = getModelForClass(PasswordResetToken)
PasswordResetToken.mongo = PasswordResetTokenModel

export default PasswordResetToken
