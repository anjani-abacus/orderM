import { Box, ToggleButtonGroup, ToggleButton, Typography, alpha } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { chartColors } from '../../utils/chartTheme';

const DateRangeFilter = ({ value, onChange }) => {
    const options = [
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' },
        { value: 'all', label: 'All time' },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: alpha('#fff', 0.6) }}>
                <CalendarToday sx={{ fontSize: 18 }} />
                <Typography variant="body2">Period:</Typography>
            </Box>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={(e, val) => val && onChange(val)}
                size="small"
                sx={{
                    '& .MuiToggleButton-root': {
                        color: alpha('#fff', 0.7),
                        borderColor: alpha(chartColors.primary, 0.3),
                        px: 2,
                        py: 0.5,
                        fontSize: '0.8rem',
                        textTransform: 'none',
                        '&.Mui-selected': {
                            background: alpha(chartColors.primary, 0.2),
                            color: chartColors.primary,
                            borderColor: chartColors.primary,
                            boxShadow: `0 0 10px ${alpha(chartColors.primary, 0.3)}`,
                            '&:hover': {
                                background: alpha(chartColors.primary, 0.3),
                            },
                        },
                        '&:hover': {
                            background: alpha(chartColors.primary, 0.1),
                        },
                    },
                }}
            >
                {options.map(option => (
                    <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};

export default DateRangeFilter;
