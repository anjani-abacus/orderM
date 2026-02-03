import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Order, OrderStatus, User } from '../generated/prisma';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrderStats } from './models/order-stats.model';
import { DateStats, StatusStats, UserStats } from './models/analytics.model';

export type OrderWithUser = Order & { user: User };

interface RequestUser {
  sub: string;
  role: string;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    input: CreateOrderInput,
    user: RequestUser,
  ): Promise<OrderWithUser> {
    return this.prisma.order.create({
      data: {
        orderNo: input.orderNo,
        status: input.status,
        amount: input.amount,
        userId: user.sub,
      },
      include: { user: true },
    });
  }

  async findAll(user: RequestUser): Promise<OrderWithUser[]> {
    const isAdmin = user.role === 'ADMIN';
    if (isAdmin) {
      return this.prisma.order.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.order.findMany({
      where: { userId: user.sub },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    input: UpdateOrderInput,
    user: RequestUser,
  ): Promise<OrderWithUser> {
    const order = await this.prisma.order.findUnique({
      where: { id: input.id },
    });

    if (!order) throw new Error('Order not found');

    const isAdmin = user.role === 'ADMIN';
    if (!isAdmin && order.userId !== user.sub) {
      throw new ForbiddenException('Not allowed');
    }

    return this.prisma.order.update({
      where: { id: input.id },
      data: { status: input.status },
      include: { user: true },
    });
  }

  async stats(user: RequestUser): Promise<OrderStats> {
    const isAdmin = user.role === 'ADMIN';
    const where = isAdmin ? {} : { userId: user.sub };

    const [count, totalAmount] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return {
      totalOrders: count,
      totalRevenue: (totalAmount._sum.amount as number) || 0,
    };
  }

  // Advanced Analytics: Orders by Date (last N days)
  async ordersByDate(days: number = 30): Promise<DateStats[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = (await this.prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, amount: true },
    })) as { createdAt: Date; amount: number }[];

    // Group by date
    const grouped: Record<string, { count: number; revenue: number }> = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { count: 0, revenue: 0 };
      }
      grouped[date].count++;
      grouped[date].revenue += order.amount;
    });

    return Object.entries(grouped)
      .map(([date, data]: [string, { count: number; revenue: number }]) => ({
        date,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Advanced Analytics: Orders by Status
  async ordersByStatus(): Promise<StatusStats[]> {
    const statuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.CANCELLED,
    ];
    const results = await Promise.all(
      statuses.map(async (status) => {
        const [count, aggregate] = await Promise.all([
          this.prisma.order.count({ where: { status } }),
          this.prisma.order.aggregate({
            where: { status },
            _sum: { amount: true },
          }),
        ]);
        return {
          status,
          count,
          revenue: (aggregate._sum.amount as number) || 0,
        };
      }),
    );
    return results;
  }

  // Advanced Analytics: Orders by User (top N users)
  async ordersByUser(limit: number = 10): Promise<UserStats[]> {
    const orders = (await this.prisma.order.findMany({
      include: { user: { select: { id: true, name: true } } },
    })) as Array<Order & { user: { id: string; name: string } }>;

    // Group by user
    const grouped: Record<
      string,
      { userName: string; count: number; revenue: number }
    > = {};
    orders.forEach((order) => {
      const userId = order.userId;
      if (!grouped[userId]) {
        grouped[userId] = {
          userName: order.user?.name || 'Unknown',
          count: 0,
          revenue: 0,
        };
      }
      grouped[userId].count++;
      grouped[userId].revenue += order.amount;
    });

    return Object.entries(grouped)
      .map(([userId, data]) => ({
        userId,
        userName: data.userName,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
