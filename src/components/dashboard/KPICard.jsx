import { Box, Typography, alpha } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const KPICard = ({
    title,
    value,
    subtitle,
    trend = 0,
    trendLabel = 'vs last period',
    sparklineData = [],
    icon,
    color = '#84cc16',
    format = 'number'
}) => {
    const getTrendIcon = () => {
        if (trend > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
        if (trend < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
        return <TrendingFlat sx={{ fontSize: 16 }} />;
    };

    const getTrendColor = () => {
        if (trend > 0) return '#2ed573';
        if (trend < 0) return '#ff4757';
        return '#ffa502';
    };

    const formatValue = (val) => {
        if (format === 'currency') {
            return `₹${val.toLocaleString('en-IN')}`;
        }
        if (format === 'percent') {
            return `${val}%`;
        }
        return val.toLocaleString('en-IN');
    };

    return (
        <Box
            sx={{
                background: `linear-gradient(145deg, #12121a 0%, rgba(26, 26, 46, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(color, 0.3)}`,
                borderRadius: 2,
                padding: 2.5,
                boxShadow: `0 0 20px ${alpha(color, 0.15)}, inset 0 0 20px ${alpha(color, 0.05)}`,
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    border: `1px solid ${alpha(color, 0.5)}`,
                    boxShadow: `0 0 30px ${alpha(color, 0.25)}, inset 0 0 30px ${alpha(color, 0.1)}`,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Header with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: alpha('#fff', 0.7),
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                    }}
                >
                    {title}
                </Typography>
                {icon && (
                    <Box sx={{ color: alpha(color, 0.6) }}>
                        {icon}
                    </Box>
                )}
            </Box>

            {/* Main Value */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    color: color,
                    textShadow: `0 0 20px ${alpha(color, 0.4)}`,
                    mb: 0.5,
                }}
            >
                {formatValue(value)}
            </Typography>

            {/* Subtitle */}
            {subtitle && (
                <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), mb: 1 }}>
                    {subtitle}
                </Typography>
            )}

            {/* Trend and Sparkline Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                {/* Trend Indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            color: getTrendColor(),
                            backgroundColor: alpha(getTrendColor(), 0.15),
                            padding: '2px 6px',
                            borderRadius: 1,
                        }}
                    >
                        {getTrendIcon()}
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {Math.abs(trend)}%
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), ml: 0.5 }}>
                        {trendLabel}
                    </Typography>
                </Box>

                {/* Mini Sparkline */}
                {sparklineData.length > 0 && (
                    <Box sx={{ width: 60, height: 24 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sparklineData}>
                                <defs>
                                    <linearGradient id={`sparkline-${title}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={1.5}
                                    fill={`url(#sparkline-${title})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default KPICard;
