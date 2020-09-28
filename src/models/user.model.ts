import {
  Field,
  HideField,
  ObjectType,
  registerEnumType
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from './model.model';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role'
});

@ObjectType()
@Schema({ timestamps: true })
export class User extends Model {
  @Field()
  @Prop({ unique: true })
  username: string;

  @HideField()
  @Prop()
  password: string;

  @Field()
  @Prop({ unique: true })
  email: string;

  @Field(() => Role)
  @Prop()
  role: Role;

  @Field()
  @Prop({ default: false })
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
