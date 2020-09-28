import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ConnectRedis from 'connect-redis';
import * as session from 'express-session';
import { RedisService } from 'nestjs-redis';
import { NestSessionOptions, SessionModule } from 'nestjs-session';
import { ENV, _prod } from '../../common/constants';

const RedisStore = ConnectRedis(session);

export const Session: DynamicModule = SessionModule.forRootAsync({
  inject: [RedisService, ConfigService],
  useFactory: (
    redisService: RedisService,
    configService: ConfigService,
  ): NestSessionOptions => {
    const redis = redisService.getClient('redis');
    const store = new RedisStore({
      client: redis as any,
      disableTouch: true,
    });
    return {
      session: {
        store,
        secret: configService.get(ENV.SECRET),
        name: configService.get(ENV.COOKIE_NAME),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          httpOnly: true,
          sameSite: 'lax',
          secure: _prod,
        },
        saveUninitialized: false,
        resave: false,
      },
    };
  },
});
