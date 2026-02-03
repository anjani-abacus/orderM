import { Field, ObjectType, ID } from "@nestjs/graphql";
import { Role } from "@prisma/client";

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
