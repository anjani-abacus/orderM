import { Box, Typography, Avatar, LinearProgress, alpha } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';
import { useMemo } from 'react';
import { chartColors, formatCurrency } from '../../utils/chartTheme';

const RepresentativePerformance = ({ orders }) => {
    const repData = useMemo(() => {
        const reps = {};

        orders.forEach(order => {
            const rep = order.representative;
            if (!rep) return;

            if (!reps[rep]) {
                reps[rep] = {
                    name: rep,
                    totalRevenue: 0,
                    orderCount: 0,
                    completedOrders: 0,
                };
            }

            reps[rep].totalRevenue += order.totalAmount || 0;
            reps[rep].orderCount += 1;
            if (order.status === 'COMPLETED') {
                reps[rep].completedOrders += 1;
            }
        });

        const result = Object.values(reps).sort((a, b) => b.totalRevenue - a.totalRevenue);
        const maxRevenue = Math.max(...result.map(r => r.totalRevenue), 1);

        return result.map((rep, index) => ({
            ...rep,
            percentage: (rep.totalRevenue / maxRevenue) * 100,
            completionRate: rep.orderCount > 0 ? (rep.completedOrders / rep.orderCount) * 100 : 0,
            rank: index + 1,
        }));
    }, [orders]);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRankColor = (rank) => {
        if (rank === 1) return '#ffd700'; // Gold
        if (rank === 2) return '#c0c0c0'; // Silver
        if (rank === 3) return '#cd7f32'; // Bronze
        return alpha('#fff', 0.5);
    };

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmojiEvents sx={{ color: '#ffd700' }} />
                <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600 }}>
                    Sales Performance
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {repData.map((rep) => (
                    <Box
                        key={rep.name}
                        sx={{
                            padding: 2,
                            borderRadius: 2,
                            background: alpha(chartColors.primary, 0.03),
                            border: `1px solid ${alpha(chartColors.primary, 0.15)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: alpha(chartColors.primary, 0.08),
                            },
                        }}
                    >
                        {/* Header Row */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                            {/* Rank Badge */}
                            {rep.rank <= 3 && (
                                <Box
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: alpha(getRankColor(rep.rank), 0.2),
                                        border: `2px solid ${getRankColor(rep.rank)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 0 8px ${alpha(getRankColor(rep.rank), 0.5)}`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: getRankColor(rep.rank),
                                            fontWeight: 700,
                                            fontSize: '0.65rem',
                                        }}
                                    >
                                        {rep.rank}
                                    </Typography>
                                </Box>
                            )}

                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    background: `linear-gradient(135deg, ${chartColors.secondary} 0%, ${chartColors.primary} 100%)`,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                }}
                            >
                                {getInitials(rep.name)}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                                    {rep.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                                    {rep.orderCount} orders • {rep.completionRate.toFixed(0)}% completion
                                </Typography>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: chartColors.success,
                                    fontWeight: 700,
                                }}
                            >
                                {formatCurrency(rep.totalRevenue)}
                            </Typography>
                        </Box>

                        {/* Progress Bar */}
                        <LinearProgress
                            variant="determinate"
                            value={rep.percentage}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: alpha(chartColors.primary, 0.15),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                    background: `linear-gradient(90deg, ${chartColors.primary} 0%, ${chartColors.success} 100%)`,
                                    boxShadow: `0 0 10px ${alpha(chartColors.primary, 0.5)}`,
                                },
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RepresentativePerformance;
