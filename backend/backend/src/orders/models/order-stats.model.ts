import { ObjectType, Field, Int, Float } from "@nestjs/graphql";

@ObjectType()
export class OrderStats {
  @Field(() => Int)
  totalOrders: number;

  @Field(() => Float)
  totalRevenue: number;
}
