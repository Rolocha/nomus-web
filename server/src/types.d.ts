declare namespace Express {
  interface Request {
    user?: import('src/models/User').User
  }
}

declare module NodeJS {
  interface Global {
    __MONGO_URI__: string
    __MONGO_DB_NAME__: string
  }
}
