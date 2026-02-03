import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { OrderStatus } from "@prisma/client";
import { User } from "../../users/models/user.model";

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNo: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  amount: number;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;
}
