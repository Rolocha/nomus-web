import { Model, Document } from 'mongoose'
import { buildSchemaSync, MiddlewareFn } from 'type-graphql'
import { getClassForDocument } from '@typegoose/typegoose'

import resolvers from 'src/graphql/resolvers'
import { schemaAuthChecker } from 'src/graphql/auth'

const typegooseMiddleware: MiddlewareFn = async (_, next) => {
  const result = await next()

  if (Array.isArray(result)) {
    return result.map((item) => (item instanceof Model ? convertDocument(item) : item))
  }

  if (result instanceof Model) {
    return convertDocument(result)
  }

  return result
}

const convertDocument = (doc: Document) => {
  const convertedDocument = doc.toObject()
  const DocumentClass = getClassForDocument(doc)!
  Object.setPrototypeOf(convertedDocument, DocumentClass.prototype)
  return convertedDocument
}

export const createSchema = () => {
  const schema = buildSchemaSync({
    resolvers,
    authChecker: schemaAuthChecker,
    globalMiddlewares: [typegooseMiddleware],
  })
  return schema
}

export default createSchema()
