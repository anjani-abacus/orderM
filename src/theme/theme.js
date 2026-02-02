import { createTheme, alpha } from '@mui/material/styles';

// Nexpher-inspired color palette with dark background
const accentGreen = '#84cc16'; // Lime green accent
const accentDark = '#65a30d'; // Darker green
const darkBg = '#0a0a0f';
const cardBg = '#12121a';
const surfaceBg = '#1a1a2e';

export const glowEffect = (color = accentGreen, intensity = 0.5) => ({
    boxShadow: `0 0 10px ${alpha(color, intensity)}, 0 0 20px ${alpha(color, intensity * 0.5)}, 0 0 30px ${alpha(color, intensity * 0.3)}`,
});

export const glowBorder = (color = accentGreen) => ({
    border: `1px solid ${alpha(color, 0.5)}`,
    boxShadow: `0 0 10px ${alpha(color, 0.3)}, inset 0 0 10px ${alpha(color, 0.1)}`,
});

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: accentGreen,
            light: '#a3e635',
            dark: accentDark,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ffffff',
            light: '#ffffff',
            dark: '#e2e8f0',
        },
        background: {
            default: darkBg,
            paper: cardBg,
        },
        text: {
            primary: '#ffffff',
            secondary: alpha('#ffffff', 0.7),
        },
        error: {
            main: '#ef4444',
        },
        success: {
            main: '#22c55e',
        },
        warning: {
            main: '#f59e0b',
        },
        divider: alpha(accentGreen, 0.2),
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `linear-gradient(135deg, ${darkBg} 0%, ${surfaceBg} 50%, ${darkBg} 100%)`,
                    minHeight: '100vh',
                },
                '*::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '*::-webkit-scrollbar-track': {
                    background: darkBg,
                },
                '*::-webkit-scrollbar-thumb': {
                    background: alpha(accentGreen, 0.3),
                    borderRadius: '4px',
                },
                '*::-webkit-scrollbar-thumb:hover': {
                    background: alpha(accentGreen, 0.5),
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(145deg, ${cardBg} 0%, ${alpha(surfaceBg, 0.8)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(accentGreen, 0.2)}`,
                    boxShadow: `0 0 20px ${alpha(accentGreen, 0.1)}, inset 0 0 20px ${alpha(accentGreen, 0.05)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        border: `1px solid ${alpha(accentGreen, 0.4)}`,
                        boxShadow: `0 0 30px ${alpha(accentGreen, 0.2)}, inset 0 0 30px ${alpha(accentGreen, 0.1)}`,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    background: `linear-gradient(145deg, ${cardBg} 0%, ${alpha(surfaceBg, 0.8)} 100%)`,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 24px',
                    transition: 'all 0.3s ease',
                },
                contained: {
                    background: `linear-gradient(135deg, ${accentGreen} 0%, ${accentDark} 100%)`,
                    boxShadow: `0 0 20px ${alpha(accentGreen, 0.4)}`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${accentDark} 0%, ${accentGreen} 100%)`,
                        boxShadow: `0 0 30px ${alpha(accentGreen, 0.6)}`,
                        transform: 'translateY(-2px)',
                    },
                },
                outlined: {
                    borderColor: alpha(accentGreen, 0.5),
                    '&:hover': {
                        borderColor: accentGreen,
                        boxShadow: `0 0 15px ${alpha(accentGreen, 0.3)}`,
                        background: alpha(accentGreen, 0.1),
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        background: alpha(darkBg, 0.5),
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                            borderColor: alpha(accentGreen, 0.3),
                            transition: 'all 0.3s ease',
                        },
                        '&:hover fieldset': {
                            borderColor: alpha(accentGreen, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: accentGreen,
                            boxShadow: `0 0 15px ${alpha(accentGreen, 0.3)}`,
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    background: alpha(darkBg, 0.5),
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(accentGreen, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(accentGreen, 0.5),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: accentGreen,
                        boxShadow: `0 0 15px ${alpha(accentGreen, 0.3)}`,
                    },
                },
            },
        },
        MuiStepper: {
            styleOverrides: {
                root: {
                    padding: '24px',
                },
            },
        },
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    '&.Mui-active': {
                        color: accentGreen,
                        textShadow: `0 0 10px ${alpha(accentGreen, 0.5)}`,
                    },
                    '&.Mui-completed': {
                        color: '#22c55e',
                    },
                },
            },
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    '&.Mui-active': {
                        color: accentGreen,
                        filter: `drop-shadow(0 0 8px ${alpha(accentGreen, 0.8)})`,
                    },
                    '&.Mui-completed': {
                        color: '#22c55e',
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        background: alpha(accentGreen, 0.1),
                        color: accentGreen,
                        fontWeight: 600,
                        borderBottom: `2px solid ${alpha(accentGreen, 0.3)}`,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: alpha(accentGreen, 0.05),
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                },
                filled: {
                    background: alpha(accentGreen, 0.2),
                    color: accentGreen,
                    '&:hover': {
                        background: alpha(accentGreen, 0.3),
                    },
                },
                outlined: {
                    borderColor: alpha(accentGreen, 0.5),
                    '&:hover': {
                        background: alpha(accentGreen, 0.1),
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    border: `1px solid ${alpha(accentGreen, 0.3)}`,
                    boxShadow: `0 0 40px ${alpha(accentGreen, 0.2)}`,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    background: `linear-gradient(180deg, ${cardBg} 0%, ${darkBg} 100%)`,
                    borderRight: `1px solid ${alpha(accentGreen, 0.2)}`,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(90deg, ${darkBg} 0%, ${cardBg} 50%, ${darkBg} 100%)`,
                    borderBottom: `1px solid ${alpha(accentGreen, 0.2)}`,
                    boxShadow: `0 0 20px ${alpha(accentGreen, 0.1)}`,
                },
            },
        },
    },
});

export default theme;
