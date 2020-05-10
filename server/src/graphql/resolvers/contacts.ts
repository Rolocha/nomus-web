import { Resolver, Query, Ctx, Authorized, Arg, ObjectType, Field } from 'type-graphql'
import MUUID from 'uuid-mongodb'

import { AdminOnlyArgs } from '../auth'
import { IApolloContext } from 'src/graphql/types'
import User, { Role } from 'src/models/User'
import Connection from 'src/models/Connection'
import { PersonName } from 'src/models/subschemas'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { CardVersion } from 'src/models/CardVersion'

@ObjectType()
class Contact {
  @Field((type) => UUIDScalar)
  id: UUIDType

  @Field((type) => PersonName)
  name: PersonName

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  notes: string

  @Field({ nullable: true })
  cardImageUrl: string

  @Field({ nullable: true })
  vcfUrl: string
}

@Resolver()
class ContactsResolver {
  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [Contact])
  async contacts(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Contact[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    const connections = await Connection.mongo
      .find({ from: MUUID.from(requestedUserId) })
      .populate({
        path: 'to',
        populate: {
          path: 'defaultCardVersion',
        },
      })

    return connections.map((connection) => {
      return {
        id: (connection.to as User)._id,
        name: (connection.to as User).name,
        phoneNumber: (connection.to as User).phoneNumber,
        email: (connection.to as User).email,
        vcfUrl: (connection.to as User).vcfUrl,
        cardImageUrl: ((connection.to as User).defaultCardVersion as CardVersion | null)?.imageUrl,
        notes: connection.notes,
      }
    })
  }

  @Query(() => Contact)
  async contact(
    @Arg('contactId', { nullable: false }) contactId: string,
    @Ctx() context: IApolloContext
  ): Promise<Contact> {
    if (context.user.roles.includes(Role.Admin)) {
      const requestedUser = await User.mongo
        .findOne({ _id: MUUID.from(contactId) })
        .populate({ path: 'defaultCardVersion' })

      return {
        id: requestedUser._id,
        name: requestedUser.name,
        phoneNumber: requestedUser.phoneNumber,
        email: requestedUser.email,
        vcfUrl: requestedUser.vcfUrl,
        cardImageUrl: (requestedUser.defaultCardVersion as CardVersion | null)?.imageUrl,
        notes: null,
      }
    } else {
      const connection = await Connection.mongo
        .findOne({ from: context.user._id, to: MUUID.from(contactId) })
        .populate({
          path: 'from',
          populate: {
            path: 'defaultCardVersion',
          },
        })
        .populate({
          path: 'to',
          populate: {
            path: 'defaultCardVersion',
          },
        })

      return {
        id: (connection.to as User)._id,
        name: (connection.to as User).name,
        phoneNumber: (connection.to as User).phoneNumber,
        email: (connection.to as User).email,
        vcfUrl: (connection.to as User).vcfUrl,
        cardImageUrl: ((connection.to as User).defaultCardVersion as CardVersion | null)?.imageUrl,
        notes: connection.notes,
      }
    }
  }
}

export default ContactsResolver
