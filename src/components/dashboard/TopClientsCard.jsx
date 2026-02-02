import { Box, Typography, Avatar, alpha } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useMemo } from 'react';
import { chartColors, formatCurrency } from '../../utils/chartTheme';

const TopClientsCard = ({ orders }) => {
    const topClients = useMemo(() => {
        const clientData = {};

        orders.forEach(order => {
            if (order.status !== 'CANCELLED') {
                const key = order.companyName;
                if (!clientData[key]) {
                    clientData[key] = {
                        companyName: order.companyName,
                        clientName: order.clientName,
                        totalRevenue: 0,
                        orderCount: 0,
                    };
                }
                clientData[key].totalRevenue += order.totalAmount || 0;
                clientData[key].orderCount += 1;
            }
        });

        return Object.values(clientData)
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5);
    }, [orders]);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const avatarColors = [
        chartColors.primary,
        chartColors.secondary,
        chartColors.success,
        chartColors.warning,
        '#9c88ff',
    ];

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
                <TrendingUp sx={{ color: chartColors.success }} />
                <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600 }}>
                    Top Clients
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topClients.map((client, index) => (
                    <Box
                        key={client.companyName}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            padding: 1.5,
                            borderRadius: 2,
                            background: alpha(avatarColors[index], 0.05),
                            border: `1px solid ${alpha(avatarColors[index], 0.2)}`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                background: alpha(avatarColors[index], 0.1),
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        {/* Rank & Avatar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: alpha('#fff', 0.5),
                                    fontWeight: 600,
                                    width: 16,
                                }}
                            >
                                #{index + 1}
                            </Typography>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    background: `linear-gradient(135deg, ${avatarColors[index]} 0%, ${alpha(avatarColors[index], 0.6)} 100%)`,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    boxShadow: `0 0 10px ${alpha(avatarColors[index], 0.4)}`,
                                }}
                            >
                                {getInitials(client.companyName)}
                            </Avatar>
                        </Box>

                        {/* Client Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    color: '#fff',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {client.companyName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                                {client.orderCount} order{client.orderCount > 1 ? 's' : ''}
                            </Typography>
                        </Box>

                        {/* Revenue */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: chartColors.success,
                                fontWeight: 700,
                                textShadow: `0 0 10px ${alpha(chartColors.success, 0.3)}`,
                            }}
                        >
                            {formatCurrency(client.totalRevenue)}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TopClientsCard;
