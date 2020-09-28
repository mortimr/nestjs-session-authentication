import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GqlAuthGuard } from 'src/utils/guards/graphql/gql-auth.guard';
import { User, UserSchema } from '../models/user.model';
import { UtilService } from '../shared/services/util.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, AuthResolver, UtilService, GqlAuthGuard],
})
export class AuthModule {}
