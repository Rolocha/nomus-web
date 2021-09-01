import { EMPTY_FEATURE_SET, NomusProFeatureSet } from 'src/models/subschemas'
import { Field, ObjectType } from 'type-graphql'

@ObjectType({ description: "Information about the user's Nomus Pro subscription" })
export class NomusProAccessInfo {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: true, defaultValue: null })
  hasAccessUntil: number | null

  @Field({ nullable: true, defaultValue: EMPTY_FEATURE_SET })
  featureSet: NomusProFeatureSet | null
}

export const EMPTY_ACCESS_INFO: NomusProAccessInfo = {
  id: null,
  hasAccessUntil: null,
  featureSet: EMPTY_FEATURE_SET,
}
