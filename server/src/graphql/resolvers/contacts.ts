import { IApolloContext } from 'src/graphql/types'
import { DocumentType } from '@typegoose/typegoose'
import Connection from 'src/models/Connection'
import { UUIDScalar, UUIDType } from 'src/models/scalars'
import { PersonName } from 'src/models/subschemas'
import { User } from 'src/models/User'
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import MUUID from 'uuid-mongodb'
import { AdminOnlyArgs } from '../auth'
import { CardVersion } from 'src/models/CardVersion'
import { Role } from 'src/util/enums'

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
  profilePicUrl: string

  @Field({ nullable: true })
  cardFrontImageUrl: string

  @Field({ nullable: true })
  cardBackImageUrl: string

  @Field({ nullable: true })
  vcfUrl: string

  //unique to the connections, notes taken by the user querying
  @Field({ nullable: true })
  notes?: string

  @Field({ nullable: true })
  meetingPlace?: string

  @Field({ nullable: true })
  meetingDate?: Date

  @Field({ nullable: true })
  connected?: boolean
}

@InputType()
class NotesDataInput {
  @Field({ nullable: true })
  meetingPlace?: string

  @Field({ nullable: true })
  meetingDate?: Date

  //unique to the connections, notes taken by the user querying
  @Field({ nullable: true })
  additionalNotes?: string
}

const userToContact = async (user: DocumentType<User>): Promise<Contact> => {
  return {
    id: user._id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    vcfUrl: user.vcfUrl,
    cardFrontImageUrl: (user.defaultCardVersion as CardVersion | null)?.frontImageUrl,
    cardBackImageUrl: (user.defaultCardVersion as CardVersion | null)?.backImageUrl,
    bio: user.bio,
    headline: user.headline,
    profilePicUrl: await user.getProfilePicUrl(),
    username: user.username,
  }
}

const connectionToContact = async (connection: Connection): Promise<Contact> => {
  const connectionUser = connection.to as DocumentType<User>
  return {
    ...(await userToContact(connectionUser)),
    meetingPlace: connection.meetingPlace,
    meetingDate: connection.meetingDate,
    notes: connection.notes,
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

    return await Promise.all(connections.map(connectionToContact))
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

  @Query(() => Contact)
  async publicContact(@Arg('username') username: string, @Ctx() context: IApolloContext) {
    const contactUser = await (await User.mongo.findOne({ username }))
      .populate('defaultCardVersion')
      .execPopulate()

    let connected = false
    if (context.user != null) {
      const existingConnection = await Connection.mongo.findOne({
        from: MUUID.from(context.user.id),
        to: MUUID.from(contactUser.id),
      })
      if (existingConnection != null) {
        connected = true
      }
    }

    const contact = await userToContact(contactUser)
    return { ...contact, connected }
  }

  @Mutation(() => Contact)
  async saveContact(
    @Arg('username') username: string,
    @Arg('notesData', { nullable: true }) notesData: NotesDataInput | null,
    @Ctx() context: IApolloContext
  ): Promise<Contact> {
    const contactUser = await User.mongo.findOne({
      username,
    })

    if (contactUser == null) {
      throw new Error(`No user found with the username ${username}`)
    }

    const existingConnection = await Connection.mongo.findOne({
      from: MUUID.from(context.user.id),
      to: MUUID.from(contactUser.id),
    })

    if (existingConnection != null) {
      throw new Error('Contact already saved')
    }

    const connection = await Connection.mongo.create({
      from: MUUID.from(context.user.id),
      to: MUUID.from(contactUser.id),
      meetingDate: notesData?.meetingDate ?? undefined,
      meetingPlace: notesData?.meetingPlace ?? undefined,
      notes: notesData?.additionalNotes ?? undefined,
    })

    await connection.populate('from').populate('to').execPopulate()

    return connectionToContact(connection)
  }
}

export default ContactsResolver
