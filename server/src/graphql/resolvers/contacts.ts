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
  //id of the user whose contact is being queried
  @Field((type) => UUIDScalar)
  id: UUIDType

  @Field((type) => PersonName)
  name: PersonName

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  email: string

  //unique to the connections, notes taken by the user querying
  @Field({ nullable: true })
  notes: string

  @Field({ nullable: true })
  cardImageUrl: string

  @Field({ nullable: true })
  vcfUrl: string
}

@Resolver()
class ContactsResolver {
  // The `contacts` query is for a list of contacts that
  // the querying user has as connections. This returns a list of all
  // contacts the querying user has.
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

  // The contact query returns a specific user's contact information
  // It checks that the user is actually connected before returning the information
  @Query(() => Contact)
  async contact(
    @Arg('contactId', { nullable: false }) contactId: string,
    @Ctx() context: IApolloContext
  ): Promise<Contact> {
    const connection = await Connection.mongo
      .findOne({ from: context.user._id, to: MUUID.from(contactId) })
      .populate({
        path: 'to',
        populate: {
          path: 'defaultCardVersion',
        },
      })

    if (!connection) {
      throw new Error('No connection exists between current user and queried user')
    }

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

export default ContactsResolver
