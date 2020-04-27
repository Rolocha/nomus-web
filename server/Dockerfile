FROM node:12

# Non-development values will be provided by Drone when
# deploying to staging or production
ARG ENV="development"

WORKDIR /server

COPY package.json .
COPY yarn.lock .

RUN yarn install --production=false

COPY . .

# In non-dev environments, we need to build executable code
# during image build time so that we're not doing it at
# container startup (which would cause significant down-time)
RUN if [ $ENV = "staging" ] || [ $ENV = "production" ]; \
  yarn build;  \
  fi

CMD ["yarn", "serve"]