import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DateStats {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType()
export class StatusStats {
  @Field()
  status: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  revenue: number;
}

@ObjectType()
export class UserStats {
  @Field()
  userId: string;

  @Field()
  userName: string;

  @Field(() => Int)
  count: number;

  @Field(() => Float)
  revenue: number;
}
