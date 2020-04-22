FROM node:12
ARG ENV

WORKDIR /client

COPY package.json .
COPY yarn.lock .

RUN yarn --production=false

COPY . .

RUN if [ $ENV = "staging" ] || [ $ENV = "production" ]; \
  then yarn global add http-server; \
  yarn build;  \
  fi