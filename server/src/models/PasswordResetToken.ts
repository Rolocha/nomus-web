import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { passwordResetTokenLifespan } from 'src/config'
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

  @prop({ required: false, default: () => Date.now() + passwordResetTokenLifespan })
  expiresAtMs: number // ms since epoch

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
    return this.expiresAtMs > Date.now()
  }

  public static async verify(
    this: ReturnModelType<typeof PasswordResetToken>,
    proposedToken: string,
    associatedUser: string
  ): Promise<boolean> {
    try {
      const tokensForThisUser = await this.find({ client: associatedUser })
      for (const token of tokensForThisUser) {
        const tokenMatches = await bcrypt.compare(proposedToken, token.value)
        if (tokenMatches) {
          if (token.expiresAtMs > Date.now()) {
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
export const PasswordResetTokenModel = getModelForClass(PasswordResetToken)
PasswordResetToken.mongo = PasswordResetTokenModel

export default PasswordResetToken
