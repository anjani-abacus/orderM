import { TextField, alpha } from '@mui/material';
import { forwardRef } from 'react';

const GlowInput = forwardRef(({ glowColor = '#00f5ff', ...props }, ref) => {
    return (
        <TextField
            ref={ref}
            fullWidth
            variant="outlined"
            sx={{
                '& .MuiOutlinedInput-root': {
                    background: alpha('#0a0a0f', 0.5),
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                        borderColor: alpha(glowColor, 0.3),
                        transition: 'all 0.3s ease',
                    },
                    '&:hover fieldset': {
                        borderColor: alpha(glowColor, 0.5),
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: glowColor,
                        boxShadow: `0 0 15px ${alpha(glowColor, 0.4)}, 0 0 30px ${alpha(glowColor, 0.2)}`,
                    },
                },
                '& .MuiInputLabel-root': {
                    color: alpha('#ffffff', 0.7),
                    '&.Mui-focused': {
                        color: glowColor,
                    },
                },
            }}
            {...props}
        />
    );
});

GlowInput.displayName = 'GlowInput';

export default GlowInput;
