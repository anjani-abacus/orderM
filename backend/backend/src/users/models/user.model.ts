import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';

// Define Role enum for GraphQL
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isActive: boolean;
}
