import { IApolloContext } from 'src/graphql/types'
import { DocumentType } from '@typegoose/typegoose'
import Connection from 'src/models/Connection'
import { PersonName } from 'src/models/subschemas'
import { User } from 'src/models/User'
import { Matches } from 'class-validator'
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
import { AdminOnlyArgs } from '../auth'
import { CardVersion } from 'src/models/CardVersion'
import { Role } from 'src/util/enums'
import { DATE } from 'src/util/regex'
import { getCurrentDateForDateInput } from 'src/util/date'

@ObjectType()
class Contact {
  //id of the user whose contact is being queried
  @Field()
  id: string

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

  @Field(() => [String], { nullable: true })
  tags?: Array<string>

  @Field({ nullable: true })
  meetingPlace?: string

  @Field({ nullable: true })
  meetingDate?: string

  @Field({ nullable: true })
  connected?: boolean
}

@InputType({
  description:
    'Information one user saves about another such as meeting date, meeting place, and tags',
})
class ContactInfoInput {
  @Field({ nullable: true })
  meetingPlace?: string

  @Field({ nullable: true })
  @Matches(DATE['YYYY-MM-DD'])
  meetingDate?: string

  //unique to the connections, notes taken by the user querying
  @Field({ nullable: true })
  notes?: string

  @Field(() => [String], { nullable: true })
  tags?: Array<string>
}

const userToContact = async (user: DocumentType<User>): Promise<Contact> => {
  await user.populate('defaultCardVersion').execPopulate()
  return {
    id: user.id,
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

const connectionToContact = async (connection: DocumentType<Connection>): Promise<Contact> => {
  await connection.populate('to').execPopulate()
  const connectionUser = connection.to as DocumentType<User>
  return {
    ...(await userToContact(connectionUser)),
    meetingPlace: connection.meetingPlace,
    meetingDate: connection.meetingDate,
    notes: connection.notes,
    tags: connection.tags,
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

    const connections = await Connection.mongo.find({ from: requestedUserId }).populate({
      path: 'to',
      populate: {
        path: 'defaultCardVersion',
      },
    })

    return await Promise.all(connections.map(connectionToContact))
  }

  @Query(() => Contact, {
    description:
      'A public-facing set of information about a user which includes additional connection-specific notes if the requesting user has already connected with them',
    nullable: true,
  })
  async publicContact(
    @Arg('username') username: string,
    @Ctx() context: IApolloContext
  ): Promise<Contact | null> {
    const contactUser = (await User.mongo.findOne({ username })) as DocumentType<User>

    if (contactUser == null) {
      return null
    }

    if (context.user != null) {
      const existingConnection = await Connection.mongo.findOne({
        from: context.user.id,
        to: contactUser.id,
      })
      if (existingConnection != null) {
        const contact = await connectionToContact(existingConnection)
        return { ...contact, connected: true }
      } else {
        // Auto-connect the requesting user to the contact
        const contact = await this.createNewContact(context.user.id, contactUser.id, {
          meetingDate: getCurrentDateForDateInput(),
        })
        return { ...contact, connected: true }
      }
    }

    const contact = await userToContact(contactUser)
    return { ...contact, connected: false }
  }

  private async createNewContact(
    fromId: string,
    toId: string,
    contactInfo: ContactInfoInput
  ): Promise<Contact> {
    const connection = await Connection.mongo.create({
      from: fromId,
      to: toId,
      meetingDate: contactInfo?.meetingDate ?? undefined,
      meetingPlace: contactInfo?.meetingPlace ?? undefined,
      notes: contactInfo?.notes ?? undefined,
      tags: contactInfo?.tags ?? undefined,
    })

    await connection.populate('from').populate('to').execPopulate()

    return connectionToContact(connection)
  }

  @Authorized(Role.User)
  @Mutation(() => Contact, {
    description:
      'Creates a new Contact or updates the information associated with an existing contact',
  })
  async saveContact(
    @Arg('username') username: string,
    @Arg('contactInfo', { nullable: true }) contactInfo: ContactInfoInput | null,
    @Ctx() context: IApolloContext
  ): Promise<Contact> {
    const contactUser = await User.mongo.findOne({
      username,
    })

    if (contactUser == null) {
      throw new Error(`No user found with the username ${username}`)
    }

    const existingConnection = await Connection.mongo.findOne({
      from: context.user.id,
      to: contactUser.id,
    })

    if (existingConnection) {
      if (contactInfo.meetingDate != null) {
        existingConnection.meetingDate = contactInfo.meetingDate
      }
      if (contactInfo.meetingPlace != null) {
        existingConnection.meetingPlace = contactInfo.meetingPlace
      }
      if (contactInfo.tags != null) {
        // remove whitespace and empty values
        existingConnection.tags = contactInfo.tags.filter(Boolean)
      }
      if (contactInfo.notes != null) {
        existingConnection.notes = contactInfo.notes
      }
      await existingConnection.save()
      return await connectionToContact(existingConnection)
    } else {
      return await this.createNewContact(context.user.id, contactUser.id, contactInfo)
    }
  }
}

export default ContactsResolver
