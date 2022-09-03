FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock next.config.js tsconfig.json .env.local ./
COPY /lib ./lib

RUN yarn install

CMD ["yarn", "dev"]