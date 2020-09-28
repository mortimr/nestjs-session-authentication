import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType({ isAbstract: true })
export abstract class Model extends Document {
  @Field(type => ID)
  id: string;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => Date)
  updatedAt: Date;
}
