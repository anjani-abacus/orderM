import { InputType, Field, Float } from '@nestjs/graphql';
import { OrderStatus } from '../../generated/prisma';

@InputType()
export class CreateOrderInput {
  @Field()
  orderNo: string;

  @Field(() => Float)
  amount: number;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.PENDING })
  status: OrderStatus;
}
