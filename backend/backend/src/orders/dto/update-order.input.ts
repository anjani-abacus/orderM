import { InputType, Field, ID } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}
