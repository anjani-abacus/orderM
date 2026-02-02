import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Grid,
} from '@mui/material';
import {
    ShoppingCart,
    AttachMoney,
    TrendingUp,
    CheckCircle,
} from '@mui/icons-material';
import { useData } from '../context/useData';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// Dashboard Components
import KPICard from './dashboard/KPICard';
import OrdersChart from './dashboard/OrdersChart';
import StatusBreakdown from './dashboard/StatusBreakdown';
import ServiceRevenueChart from './dashboard/ServiceRevenueChart';
import RecentOrdersTable from './dashboard/RecentOrdersTable';
import TopClientsCard from './dashboard/TopClientsCard';
import RepresentativePerformance from './dashboard/RepresentativePerformance';
import DateRangeFilter from './dashboard/DateRangeFilter';

const Dashboard = () => {
    const { services, orders } = useData();
    const { user } = useAuth();
    const [dateRange, setDateRange] = useState('30d');

    // Filter orders by date range
    const filteredOrders = useMemo(() => {
        if (dateRange === 'all') return orders;

        const now = new Date();
        let daysBack;
        switch (dateRange) {
            case '7d': daysBack = 7; break;
            case '30d': daysBack = 30; break;
            case '90d': daysBack = 90; break;
            default: daysBack = 30;
        }

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysBack);

        return orders.filter(order => new Date(order.createdAt) >= startDate);
    }, [orders, dateRange]);

    // Calculate KPI metrics
    const kpiMetrics = useMemo(() => {
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const completedOrders = filteredOrders.filter(o => o.status === 'COMPLETED').length;
        const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

        // Calculate trends (compare to previous period)
        const previousPeriodOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            let daysBack;
            switch (dateRange) {
                case '7d': daysBack = 7; break;
                case '30d': daysBack = 30; break;
                case '90d': daysBack = 90; break;
                default: daysBack = 30;
            }
            const startPrevious = new Date(now);
            startPrevious.setDate(startPrevious.getDate() - (daysBack * 2));
            const endPrevious = new Date(now);
            endPrevious.setDate(endPrevious.getDate() - daysBack);
            return orderDate >= startPrevious && orderDate < endPrevious;
        });

        const prevRevenue = previousPeriodOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const prevOrders = previousPeriodOrders.length;

        const revenueTrend = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
        const ordersTrend = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

        // Generate sparkline data
        const generateSparkline = (metric) => {
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dayOrders = filteredOrders.filter(o => {
                    const oDate = new Date(o.createdAt);
                    return oDate.toDateString() === date.toDateString();
                });
                if (metric === 'orders') {
                    data.push({ value: dayOrders.length });
                } else {
                    data.push({ value: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) });
                }
            }
            return data;
        };

        return {
            totalOrders,
            totalRevenue,
            avgOrderValue,
            completionRate,
            revenueTrend: Number(revenueTrend.toFixed(1)),
            ordersTrend: Number(ordersTrend.toFixed(1)),
            revenueSparkline: generateSparkline('revenue'),
            ordersSparkline: generateSparkline('orders'),
        };
    }, [filteredOrders, orders, dateRange]);

    return (
        <>
            <Navbar />
            <Box sx={{ py: 4, px: { xs: 1, sm: 2, md: 3 }, width: '100%', overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 4
                }}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 0.5,
                            }}
                        >
                            Welcome back, {user?.name}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's your business performance overview
                        </Typography>
                    </Box>
                    <DateRangeFilter value={dateRange} onChange={setDateRange} />
                </Box>

                {/* KPI Cards Row */}
                <Grid container spacing={2} sx={{ mb: 2, width: '100%', ml: 0 }}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Box sx={{ flex: 1, borderRadius: 1 }}>
                            <KPICard
                                title="Total Orders"
                                value={kpiMetrics.totalOrders}
                                trend={kpiMetrics.ordersTrend}
                                trendLabel="vs last period"
                                sparklineData={kpiMetrics.ordersSparkline}
                                icon={<ShoppingCart />}
                                color="#00f5ff"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Box sx={{ flex: 1, borderRadius: 1 }}>
                            <KPICard
                                title="Total Revenue"
                                value={kpiMetrics.totalRevenue}
                                format="currency"
                                trend={kpiMetrics.revenueTrend}
                                trendLabel="vs last period"
                                sparklineData={kpiMetrics.revenueSparkline}
                                icon={<AttachMoney />}
                                color="#2ed573"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Box sx={{ flex: 1, borderRadius: 1 }}>
                            <KPICard
                                title="Avg Order Value"
                                value={Math.round(kpiMetrics.avgOrderValue)}
                                format="currency"
                                trend={0}
                                trendLabel="per order"
                                icon={<TrendingUp />}
                                color="#ffa502"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <Box sx={{ flex: 1, borderRadius: 1 }}>
                            <KPICard
                                title="Completion Rate"
                                value={Math.round(kpiMetrics.completionRate)}
                                format="percent"
                                subtitle={`${filteredOrders.filter(o => o.status === 'COMPLETED').length} completed`}
                                trend={0}
                                trendLabel="of orders"
                                icon={<CheckCircle />}
                                color="#0080ff"
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 2, width: '100%', ml: 0 }}>
                    <Grid item xs={12} lg={8} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 380, borderRadius: 1 }}>
                            <OrdersChart orders={orders} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 380, borderRadius: 1 }}>
                            <StatusBreakdown orders={filteredOrders} />
                        </Box>
                    </Grid>
                </Grid>

                {/* Data Tables Row - Equal height */}
                <Grid container spacing={2} sx={{ mb: 2, width: '100%', ml: 0 }}>
                    <Grid item xs={12} lg={8} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 420, borderRadius: 1 }}>
                            <RecentOrdersTable orders={filteredOrders} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 420, borderRadius: 1 }}>
                            <TopClientsCard orders={filteredOrders} />
                        </Box>
                    </Grid>
                </Grid>

                {/* Bottom Row - Equal height */}
                <Grid container spacing={2} sx={{ width: '100%', ml: 0 }}>
                    <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 380, borderRadius: 1 }}>
                            <ServiceRevenueChart orders={filteredOrders} services={services} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
                        <Box sx={{ flex: 1, minHeight: 380, borderRadius: 1 }}>
                            <RepresentativePerformance orders={filteredOrders} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;
