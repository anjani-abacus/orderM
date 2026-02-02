import { Box, alpha } from '@mui/material';

const GlowCard = ({ children, glowColor = '#00f5ff', intensity = 0.3, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                background: `linear-gradient(145deg, #12121a 0%, rgba(26, 26, 46, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(glowColor, 0.3)}`,
                borderRadius: 3,
                padding: 3,
                boxShadow: `0 0 20px ${alpha(glowColor, intensity)}, inset 0 0 20px ${alpha(glowColor, intensity * 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    border: `1px solid ${alpha(glowColor, 0.5)}`,
                    boxShadow: `0 0 30px ${alpha(glowColor, intensity * 1.5)}, inset 0 0 30px ${alpha(glowColor, intensity * 0.5)}`,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

export default GlowCard;
