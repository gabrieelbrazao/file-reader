FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npm install -g @nestjs/cli
RUN yarn build
CMD ["yarn", "start:prod"]