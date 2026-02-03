import { InputType, Field } from '@nestjs/graphql';
import { Role } from '../../generated/prisma';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
