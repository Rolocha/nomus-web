FROM node:12

WORKDIR /client

COPY package.json .
COPY yarn.lock .

RUN yarn --production=false

COPY . .

CMD ["yarn", "dev"]
