import { Resolver, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginInput } from "./dto/login.input";
import { User } from "../users/models/user.model";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Args("input") input: LoginInput,
    @Context() { res }
  ) {
    return this.authService.login(input, res);
  }

  @Mutation(() => Boolean)
  logout(@Context() { res }) {
    res.clearCookie("token");
    return true;
  }
}
