import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context as GqlContext,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './models/order.model';
import { OrderStats } from './models/order-stats.model';
import { DateStats, StatusStats, UserStats } from './models/analytics.model';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface GqlRequest {
  user: {
    sub: string;
    role: string;
    name: string;
  };
}

@Resolver(() => Order)
@UseGuards(GqlAuthGuard, RolesGuard)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @GqlContext() { req }: { req: GqlRequest },
  ): Promise<Order> {
    return this.ordersService.create(input, req.user);
  }

  @Query(() => [Order])
  async orders(@GqlContext() { req }: { req: GqlRequest }): Promise<Order[]> {
    return this.ordersService.findAll(req.user);
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('input') input: UpdateOrderInput,
    @GqlContext() { req }: { req: GqlRequest },
  ): Promise<Order> {
    return this.ordersService.updateStatus(input, req.user);
  }

  @Query(() => OrderStats)
  async orderStats(
    @GqlContext() { req }: { req: GqlRequest },
  ): Promise<OrderStats> {
    return this.ordersService.stats(req.user);
  }

  // Advanced Analytics Queries
  @Roles('ADMIN')
  @Query(() => [DateStats], { description: 'Orders grouped by date' })
  async ordersByDate(
    @Args('days', { type: () => Int, defaultValue: 30 }) days: number,
  ): Promise<DateStats[]> {
    return this.ordersService.ordersByDate(days);
  }

  @Roles('ADMIN')
  @Query(() => [StatusStats], { description: 'Orders grouped by status' })
  async ordersByStatus(): Promise<StatusStats[]> {
    return this.ordersService.ordersByStatus();
  }

  @Roles('ADMIN')
  @Query(() => [UserStats], { description: 'Orders grouped by user' })
  async ordersByUser(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<UserStats[]> {
    return this.ordersService.ordersByUser(limit);
  }
}
