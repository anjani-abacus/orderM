import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    InputAdornment,
    IconButton,
    alpha,
    Container,
} from '@mui/material';
import {
    Email,
    Lock,
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../utils/validation';
import GlowCard from '../components/GlowCard';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        setError('');
        const result = login(data.email, data.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <GlowCard
                    sx={{
                        p: { xs: 3, sm: 5 },
                        maxWidth: 450,
                        mx: 'auto',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            OrderMS
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Order Management System
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('email')}
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: alpha('#00f5ff', 0.7) }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            {...register('password')}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{ mb: 4 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: alpha('#00f5ff', 0.7) }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: alpha('#fff', 0.7) }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isSubmitting}
                            startIcon={<LoginIcon />}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Demo Credentials
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                gap: 2,
                                justifyContent: 'center',
                            }}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: alpha('#00f5ff', 0.1),
                                    border: `1px solid ${alpha('#00f5ff', 0.2)}`,
                                }}
                            >
                                <Typography variant="caption" color="primary">
                                    Admin
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    admin@demo.com
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    admin123
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: alpha('#0080ff', 0.1),
                                    border: `1px solid ${alpha('#0080ff', 0.2)}`,
                                }}
                            >
                                <Typography variant="caption" color="secondary">
                                    Staff
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    staff@demo.com
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    staff123
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </GlowCard>
            </Container>
        </Box>
    );
};

export default LoginPage;
