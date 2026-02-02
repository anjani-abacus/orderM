import { Box, Typography, ToggleButtonGroup, ToggleButton, alpha } from '@mui/material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { useState, useMemo } from 'react';
import { tooltipStyle, formatCurrency, chartColors } from '../../utils/chartTheme';

// CustomTooltip defined outside component to avoid recreating during render
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={tooltipStyle.contentStyle}>
                <Typography sx={{ ...tooltipStyle.labelStyle, mb: 1 }}>
                    {label}
                </Typography>
                <Typography sx={{ color: chartColors.primary, fontSize: '0.875rem' }}>
                    Revenue: {formatCurrency(payload[0]?.value || 0)}
                </Typography>
                <Typography sx={{ color: chartColors.success, fontSize: '0.875rem' }}>
                    Orders: {payload[1]?.value || 0}
                </Typography>
            </Box>
        );
    }
    return null;
};

const OrdersChart = ({ orders }) => {
    const [period, setPeriod] = useState('30d');

    const chartData = useMemo(() => {
        const now = new Date();
        let daysBack;

        switch (period) {
            case '7d': daysBack = 7; break;
            case '30d': daysBack = 30; break;
            case '90d': daysBack = 90; break;
            default: daysBack = 30;
        }

        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysBack);

        // Group orders by date
        const dateMap = new Map();

        // Initialize all dates in range
        for (let i = 0; i <= daysBack; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
        }

        // Aggregate order data
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
            if (dateMap.has(orderDate)) {
                const data = dateMap.get(orderDate);
                data.revenue += order.totalAmount || 0;
                data.orders += 1;
            }
        });

        // Convert to array and format dates
        return Array.from(dateMap.values()).map(item => ({
            ...item,
            displayDate: new Date(item.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
            }),
        }));
    }, [orders, period]);

    return (
        <Box
            sx={{
                background: `linear-gradient(145deg, #12121a 0%, rgba(26, 26, 46, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(chartColors.primary, 0.3)}`,
                borderRadius: 2,
                padding: 3,
                boxShadow: `0 0 20px ${alpha(chartColors.primary, 0.15)}`,
                height: '100%',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600 }}>
                        Revenue & Orders Trend
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                        Track your business performance over time
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={period}
                    exclusive
                    onChange={(e, val) => val && setPeriod(val)}
                    size="small"
                    sx={{
                        '& .MuiToggleButton-root': {
                            color: alpha('#fff', 0.7),
                            borderColor: alpha(chartColors.primary, 0.3),
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            '&.Mui-selected': {
                                background: alpha(chartColors.primary, 0.2),
                                color: chartColors.primary,
                                borderColor: chartColors.primary,
                            },
                            '&:hover': {
                                background: alpha(chartColors.primary, 0.1),
                            },
                        },
                    }}
                >
                    <ToggleButton value="7d">7D</ToggleButton>
                    <ToggleButton value="30d">30D</ToggleButton>
                    <ToggleButton value="90d">90D</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Chart */}
            <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chartColors.success} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={chartColors.success} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={chartColors.grid}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="displayDate"
                            stroke={alpha('#fff', 0.5)}
                            tick={{ fill: alpha('#fff', 0.5), fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: chartColors.grid }}
                            interval={period === '7d' ? 0 : period === '30d' ? 4 : 14}
                        />
                        <YAxis
                            yAxisId="revenue"
                            stroke={alpha('#fff', 0.5)}
                            tick={{ fill: alpha('#fff', 0.5), fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="orders"
                            orientation="right"
                            stroke={alpha('#fff', 0.5)}
                            tick={{ fill: alpha('#fff', 0.5), fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: 20 }}
                            formatter={(value) => (
                                <span style={{ color: alpha('#fff', 0.8), fontSize: '0.8rem' }}>{value}</span>
                            )}
                        />
                        <Area
                            yAxisId="revenue"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke={chartColors.primary}
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                        />
                        <Area
                            yAxisId="orders"
                            type="monotone"
                            dataKey="orders"
                            name="Orders"
                            stroke={chartColors.success}
                            strokeWidth={2}
                            fill="url(#ordersGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default OrdersChart;
