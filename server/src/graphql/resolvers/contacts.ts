import { Resolver, Query, Ctx, Authorized, Arg, ObjectType, Field } from 'type-graphql'
import MUUID from 'uuid-mongodb'

import { AdminOnlyArgs } from '../auth'
import { IApolloContext } from 'src/graphql/types'
import User, { Role } from 'src/models/User'
import Connection from 'src/models/Connection'
import { PersonName } from 'src/models/subschemas'
import { Ref } from 'src/models/scalars'
import { ConnectorDefinitionVersion } from 'aws-sdk/clients/greengrass'

@ObjectType()
class Contact {
  // @Field()
  // uid: string

  // @Field((type) => PersonName)
  // name: Ref<PersonName>

  // @Field({ nullable: true })
  // phoneNumber: string

  // @Field({ nullable: true })
  // email: string

  @Field({ nullable: true })
  notes: string

  // // @Field({ nullable: true })
  // // cardImageUrl: string

  // @Field({ nullable: true })
  // vcfUrl: string
}

@Resolver()
class ContactsResolver {
  // async contactFromConnection (connection: Connection): Promise<Contact> {
  //   const user = await User.mongo.find({ _id: connection.to})
  //   return new Contact (
  //     uid: user.id,
  //   )
  // }

  @Authorized(Role.User)
  @AdminOnlyArgs('userId')
  @Query(() => [Contact])
  async contacts(
    @Arg('userId', { nullable: true }) userId: string | null,
    @Ctx() context: IApolloContext
  ): Promise<Contact[]> {
    const requesterUserId = context.user._id
    const requestedUserId = userId ?? requesterUserId

    try {
      const connections = await Connection.mongo.find({ from: requestedUserId })
      return connections.map((connection) => ({
        notes: connection.notes,
      }))
    } catch (error) {
      const lol: Contact = new Contact()
      lol.notes = 'lol'
      const jk: Contact = new Contact()
      jk.notes = 'nah'
      return [lol, jk]
    }
    // const newlist =  connections.map((connection) => {
    //   return
    // })
  }
}

export default ContactsResolver
