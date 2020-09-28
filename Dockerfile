FROM node:12 as development

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --dev install

COPY . .

RUN yarn build

# seperate build for production
FROM node:12 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]