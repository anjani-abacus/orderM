import { InputType, Field, ID } from '@nestjs/graphql';
import { OrderStatus } from '../../generated/prisma';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}
