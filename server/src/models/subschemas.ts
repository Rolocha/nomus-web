import { ObjectType, Field } from 'type-graphql'
import { prop } from '@typegoose/typegoose'

@ObjectType()
export class PersonName {
  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  first: string

  @prop({ required: false })
  @Field({ nullable: true })
  middle?: string

  @prop({ validate: (v: string) => v.length > 0 })
  @Field()
  last: string
}

@ObjectType()
export class Address {
  @prop()
  @Field({ nullable: true })
  line1: string

  @prop()
  @Field({ nullable: true })
  line2: string

  @prop()
  @Field({ nullable: true })
  line3: string
}
