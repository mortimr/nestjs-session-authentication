# Instructions

Starter template for [NestJS](https://nestjs.com/)

## Features

- GraphQL w/ [playground](https://github.com/graphql/graphql-playground)
- Code-First w/ [decorators](https://docs.nestjs.com/graphql/quick-start#code-first)
- Mongosee https://docs.nestjs.com/techniques/mongodb
- 🔐 Session authentication w/ [nestjs-session](https://www.npmjs.com/package/nestjs-session)
- Send Grid https://sendgrid.com/

## Overview

- [Instructions](#instructions)

  - [Features](#features)
  - [Overview](#overview)
  - [Start NestJS Server](#start-nestjs-server)
  - [Playground](#playground)
  - [Rest Api](#rest-api)
  - [Docker](#docker)
  - [Schema Development](#schema-development)
  - [NestJS - Api Schema](#nestjs---api-schema)
    - [Resolver](#resolver)

### 1. Install Nestjs

The [Nestjs CLI](https://docs.nestjs.com/cli/usages) can be used to generate controller, services, resolvers and more.

```bash
npm i -g @nestjs/cli
```

**[⬆ back to top](#overview)**

## Start NestJS Server

Run Nest Server in Development mode:

```bash
npm run start

# watch mode
npm run start:local
```

Run Nest Server in Production mode:

```bash
npm run start:prod
```

Playground for the NestJS Server is available here: http://localhost:3000/graphql

**[⬆ back to top](#overview)**

## Docker

Nest serve is a Node.js application and it is easily [dockerized](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/).

See the [Dockerfile](./Dockerfile) on how to build a Docker image of your Nest server.

Now to build a Docker image of your own Nest server simply run:

1. We assume you have Linux or Mac with installed [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/).
1. Execute in a terminal (shell)`cp .env.example .env; docker-compose down; docker-compose up --build`. All old containers will be stopped and removed. Logs will be here.
1. Now open up [localhost:3000/graphql](http://localhost:3000/graphql) to verify that your nest server is running.

Executing `docker-compose down ; docker-compose up --build -V` is enough to restart.

## NestJS - Api Schema

The [schema.graphql](./src/schema.graphql) is generated with [code first approach](https://docs.nestjs.com/graphql/quick-start#code-first). The schema is generated from the [models](./src/models/user.ts), the [resolvers](./src/resolvers/auth/auth.resolver.ts) and the [input](./src/resolvers/auth/dto/login.input.ts) classes.

You can use [class-validator](https://docs.nestjs.com/techniques/validation) to validate your inputs and arguments.

### Resolver

To implement the new query, a new resolver function needs to be added to `users.resolver.ts`.

```ts
@Query(returns => User)
async getUser(@Args() args): Promise<User> {
  return await this.userModel.findOne({args});
}
```

Restart the NestJS server and this time the Query to fetch a `user` should work.

**[⬆ back to top](#overview)**
