import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";
import { CreateUserInput } from "./dto/create-user.input";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Resolver(() => User)
@UseGuards(GqlAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles("ADMIN")
  @Query(() => [User])
  users() {
    return this.usersService.findAll();
  }

  @Roles("ADMIN")
  @Mutation(() => User)
  createUser(@Args("input") input: CreateUserInput) {
    return this.usersService.create(input);
  }
}
