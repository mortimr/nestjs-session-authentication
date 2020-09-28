import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import { ENV } from 'src/common/constants';

export const Redis: DynamicModule = RedisModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService): RedisModuleOptions => {
    return {
      name: 'redis',
      host: configService.get(ENV.REDIS_HOST),
      port: configService.get(ENV.REDIS_PORT),
    };
  },
});
