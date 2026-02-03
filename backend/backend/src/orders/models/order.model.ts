import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { OrderStatus } from '@prisma/client';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

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
