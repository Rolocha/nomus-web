import { getClassForDocument } from '@typegoose/typegoose'
import { Document, Model } from 'mongoose'
import { schemaAuthChecker } from 'src/graphql/auth'
import resolvers from 'src/graphql/resolvers'
import { buildSchemaSync, MiddlewareFn } from 'type-graphql'

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
    dateScalarMode: 'timestamp', // "timestamp" or "isoDate"
  })
  return schema
}

export default createSchema()
