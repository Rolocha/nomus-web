FROM node:12

WORKDIR /server

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=false

COPY . .

CMD ["yarn", "serve"]