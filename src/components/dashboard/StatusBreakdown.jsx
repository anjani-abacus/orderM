import { Box, Typography, alpha } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { statusColors, statusLabels, tooltipStyle, chartColors } from '../../utils/chartTheme';

// CustomTooltip defined outside component to avoid recreating during render
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        // total is passed via payload's ancestor data
        const percentage = data.percentage;
        return (
            <Box sx={tooltipStyle.contentStyle}>
                <Typography sx={{ color: data.color, fontWeight: 600 }}>
                    {data.name}
                </Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.875rem' }}>
                    {data.value} orders ({percentage}%)
                </Typography>
            </Box>
        );
    }
    return null;
};

const StatusBreakdown = ({ orders }) => {
    const totalOrders = orders.length;

    const statusData = useMemo(() => {
        const counts = {};
        orders.forEach(order => {
            counts[order.status] = (counts[order.status] || 0) + 1;
        });

        return Object.entries(counts).map(([status, count]) => ({
            name: statusLabels[status] || status,
            value: count,
            color: statusColors[status] || '#888',
            status,
            percentage: ((count / orders.length) * 100).toFixed(1),
        }));
    }, [orders]);

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
            <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600, mb: 2 }}>
                Order Status
            </Typography>

            {/* Donut Chart */}
            <Box sx={{ height: 180, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {statusData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="transparent"
                                    style={{
                                        filter: `drop-shadow(0 0 6px ${alpha(entry.color, 0.5)})`,
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                        {totalOrders}
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.6) }}>
                        Total
                    </Typography>
                </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                {statusData.map((item) => (
                    <Box
                        key={item.status}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            background: alpha(item.color, 0.1),
                            padding: '4px 10px',
                            borderRadius: 2,
                            border: `1px solid ${alpha(item.color, 0.3)}`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: item.color,
                                boxShadow: `0 0 6px ${item.color}`,
                            }}
                        />
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.9) }}>
                            {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default StatusBreakdown;
