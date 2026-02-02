import { Box, Typography, alpha, LinearProgress } from '@mui/material';
import { useMemo } from 'react';
import { chartColors, formatCurrency } from '../../utils/chartTheme';

const ServiceRevenueChart = ({ orders, services }) => {
    const revenueByService = useMemo(() => {
        const serviceRevenue = {};

        orders.forEach(order => {
            if (order.status !== 'CANCELLED') {
                const serviceId = order.serviceId;
                serviceRevenue[serviceId] = (serviceRevenue[serviceId] || 0) + (order.totalAmount || 0);
            }
        });

        // Map to service names and sort by revenue
        const result = Object.entries(serviceRevenue)
            .map(([serviceId, revenue]) => {
                const service = services.find(s => s.id === serviceId);
                return {
                    serviceId,
                    name: service?.name || serviceId,
                    revenue,
                };
            })
            .sort((a, b) => b.revenue - a.revenue);

        // Calculate max for percentage bars
        const maxRevenue = Math.max(...result.map(r => r.revenue), 1);

        return result.map((item, index) => ({
            ...item,
            percentage: (item.revenue / maxRevenue) * 100,
            color: [
                chartColors.primary,
                chartColors.secondary,
                chartColors.success,
                chartColors.warning,
                '#9c88ff',
                '#fd79a8',
                '#00cec9',
            ][index % 7],
        }));
    }, [orders, services]);

    const totalRevenue = revenueByService.reduce((sum, s) => sum + s.revenue, 0);

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600 }}>
                        Revenue by Service
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>
                        Total: {formatCurrency(totalRevenue)}
                    </Typography>
                </Box>
            </Box>

            {/* Service Bars */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {revenueByService.map((service) => (
                    <Box key={service.serviceId}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: alpha('#fff', 0.9), fontWeight: 500 }}>
                                {service.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: service.color, fontWeight: 600 }}>
                                {formatCurrency(service.revenue)}
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={service.percentage}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: alpha(service.color, 0.15),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4,
                                    background: `linear-gradient(90deg, ${service.color} 0%, ${alpha(service.color, 0.7)} 100%)`,
                                    boxShadow: `0 0 10px ${alpha(service.color, 0.5)}`,
                                },
                            }}
                        />
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                            {((service.revenue / totalRevenue) * 100).toFixed(1)}% of total
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default ServiceRevenueChart;
