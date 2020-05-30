import { IApolloContext } from 'src/graphql/types'
import { CardVersion } from 'src/models/CardVersion'
import Connection from 'src/models/Connection'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { PersonName } from 'src/models/subschemas'
import User, { Role } from 'src/models/User'
import { Arg, Authorized, Ctx, Field, ObjectType, Query, Resolver } from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { AdminOnlyArgs } from '../auth'

@ObjectType()
class Contact {
  //id of the user whose contact is being queried
  @Field((type) => UUIDScalar)
  id: UUIDType

  @Field()
  username: string

  @Field((type) => PersonName)
  name: PersonName

  @Field({ nullable: true })
  phoneNumber: string

  @Field({ nullable: true })
  email: string

  @Field({ nullable: true })
  headline: string

  @Field({ nullable: true })
  bio: string

  @Field({ nullable: true })
  profilePic: string

  //unique to the connections, notes taken by the user querying
  @Field({ nullable: true })
  notes: string

  @Field({ nullable: true })
  cardFrontImageUrl: string

  @Field({ nullable: true })
  cardBackImageUrl: string

  @Field({ nullable: true })
  vcfUrl: string
}

const connectionToContact = (connection: Connection): Contact => {
  const connectionUser = connection.to as User
  return {
    id: connectionUser._id,
    name: connectionUser.name,
    phoneNumber: connectionUser.phoneNumber,
    email: connectionUser.email,
    vcfUrl: connectionUser.vcfUrl,
    cardFrontImageUrl: (connectionUser.defaultCardVersion as CardVersion | null)?.frontImageUrl,
    cardBackImageUrl: (connectionUser.defaultCardVersion as CardVersion | null)?.backImageUrl,
    notes: connection.notes,
    bio: connectionUser.bio,
    headline: connectionUser.headline,
    profilePic: connectionUser.profilePicUrl,
    username: connectionUser.username,
  }
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

    return connections.map(connectionToContact)
  }

  // The contact query returns a specific user's contact information
  // It checks that the user is actually connected before returning the information
  @Authorized(Role.User)
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

    return connectionToContact(connection)
  }

  @Query(() => CardVersion)
  async publicContact(
    @Arg('username') username: string,
    @Arg('cardNameOrId', { nullable: true }) cardNameOrId?: string
  ) {
    const cardVersion = cardNameOrId
      ? // If cardNameOrId present, find the cardVersion directly, either with its id or its name + associated user
        await CardVersion.mongo.findBySlugOrId(cardNameOrId, username)
      : // Otherwise, just get the default card version for the provided username
        await User.mongo.getDefaultCardVersionForUsername(username)
    return cardVersion
  }
}

export default ContactsResolver
