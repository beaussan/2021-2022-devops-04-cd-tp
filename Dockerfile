FROM node:lts-fermium

WORKDIR /nest-server

COPY . .

RUN yarn install


CMD ["yarn", "start"]