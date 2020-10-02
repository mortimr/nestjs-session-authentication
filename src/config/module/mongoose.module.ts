import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ENV } from 'src/common/constants';

export const Mongoose: DynamicModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService): MongooseModuleOptions => {
    return {
      uri: configService.get(ENV.MONGO_URL),
      // uri: `mongodb://${configService.get(ENV.MONGO_USER)}:${configService.get(
      //   ENV.MONGO_PASSWORD,
      // )}@${configService.get(ENV.MONGO_HOST)}:${configService.get(
      //   ENV.MONGO_PORT,
      // )}/${configService.get(ENV.MONGO_DB_NAME)}?authSource=admin`,

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    };
  },
});
