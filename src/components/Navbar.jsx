import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    alpha,
    useMediaQuery,
    useTheme,
    Divider,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    AddCircle,
    AdminPanelSettings,
    Logout,
    Close,
    Settings,
    Inventory,
    Category,
    Assignment,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['ADMIN', 'STAFF'] },
        { text: 'New Order', icon: <AddCircle />, path: '/orders/new', roles: ['ADMIN', 'STAFF'] },
    ];

    const adminMenuItems = [
        { text: 'Manage Services', icon: <Category />, path: '/admin/services' },
        { text: 'Manage Packages', icon: <Inventory />, path: '/admin/packages' },
        { text: 'Manage Activities', icon: <Assignment />, path: '/admin/activities' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const drawer = (
        <Box
            sx={{
                width: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 700,
                    }}
                >
                    OrderMS
                </Typography>
                <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#84cc16' }}>
                    <Close />
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: alpha('#84cc16', 0.2) }} />

            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Logged in as
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                    {user?.name}
                </Typography>
                <Chip
                    label={user?.role}
                    size="small"
                    sx={{
                        mt: 1,
                        background: user?.role === 'ADMIN'
                            ? alpha('#ff6b6b', 0.2)
                            : alpha('#84cc16', 0.2),
                        color: user?.role === 'ADMIN' ? '#ff6b6b' : '#84cc16',
                    }}
                />
            </Box>
            <Divider sx={{ borderColor: alpha('#84cc16', 0.2) }} />

            <List sx={{ flex: 1, pt: 2 }}>
                {menuItems
                    .filter((item) => item.roles.includes(user?.role))
                    .map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    mx: 1,
                                    borderRadius: 2,
                                    mb: 0.5,
                                    background: isActive(item.path) ? alpha('#84cc16', 0.15) : 'transparent',
                                    border: isActive(item.path)
                                        ? `1px solid ${alpha('#84cc16', 0.3)}`
                                        : '1px solid transparent',
                                    '&:hover': {
                                        background: alpha('#84cc16', 0.1),
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive(item.path) ? '#84cc16' : alpha('#fff', 0.7),
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        '& .MuiTypography-root': {
                                            color: isActive(item.path) ? '#84cc16' : '#fff',
                                            fontWeight: isActive(item.path) ? 600 : 400,
                                        },
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                {user?.role === 'ADMIN' && (
                    <>
                        <Divider sx={{ my: 2, borderColor: alpha('#84cc16', 0.2) }} />
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 40, color: alpha('#fff', 0.5) }}>
                                <AdminPanelSettings />
                            </ListItemIcon>
                            <ListItemText
                                primary="Admin Panel"
                                sx={{ '& .MuiTypography-root': { color: alpha('#fff', 0.5), fontSize: '0.875rem' } }}
                            />
                        </ListItem>
                        {adminMenuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleNavigation(item.path)}
                                    sx={{
                                        mx: 1,
                                        borderRadius: 2,
                                        mb: 0.5,
                                        background: isActive(item.path) ? alpha('#84cc16', 0.15) : 'transparent',
                                        border: isActive(item.path)
                                            ? `1px solid ${alpha('#84cc16', 0.3)}`
                                            : '1px solid transparent',
                                        '&:hover': {
                                            background: alpha('#84cc16', 0.1),
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: isActive(item.path) ? '#84cc16' : alpha('#fff', 0.7),
                                            minWidth: 40,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: isActive(item.path) ? '#84cc16' : '#fff',
                                                fontWeight: isActive(item.path) ? 600 : 400,
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                )}
            </List>

            <Divider sx={{ borderColor: alpha('#84cc16', 0.2) }} />
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            mx: 1,
                            mb: 1,
                            borderRadius: 2,
                            '&:hover': {
                                background: alpha('#ff4757', 0.1),
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: '#ff4757', minWidth: 40 }}>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            sx={{ '& .MuiTypography-root': { color: '#ff4757' } }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" elevation={0}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: isMobile ? 1 : 0,
                            mr: 4,
                            background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        OrderMS
                    </Typography>

                    {!isMobile && (
                        <>
                            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                                {menuItems
                                    .filter((item) => item.roles.includes(user?.role))
                                    .map((item) => (
                                        <Button
                                            key={item.text}
                                            startIcon={item.icon}
                                            onClick={() => handleNavigation(item.path)}
                                            sx={{
                                                color: isActive(item.path) ? '#84cc16' : '#fff',
                                                background: isActive(item.path) ? alpha('#84cc16', 0.1) : 'transparent',
                                                border: isActive(item.path)
                                                    ? `1px solid ${alpha('#84cc16', 0.3)}`
                                                    : '1px solid transparent',
                                                '&:hover': {
                                                    background: alpha('#84cc16', 0.1),
                                                },
                                            }}
                                        >
                                            {item.text}
                                        </Button>
                                    ))}

                                {user?.role === 'ADMIN' && (
                                    <Button
                                        startIcon={<AdminPanelSettings />}
                                        onClick={() => handleNavigation('/admin/services')}
                                        sx={{
                                            color: location.pathname.startsWith('/admin') ? '#84cc16' : '#fff',
                                            background: location.pathname.startsWith('/admin')
                                                ? alpha('#84cc16', 0.1)
                                                : 'transparent',
                                            border: location.pathname.startsWith('/admin')
                                                ? `1px solid ${alpha('#84cc16', 0.3)}`
                                                : '1px solid transparent',
                                            '&:hover': {
                                                background: alpha('#84cc16', 0.1),
                                            },
                                        }}
                                    >
                                        Admin Panel
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                        {user?.name}
                                    </Typography>
                                    <Chip
                                        label={user?.role}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.7rem',
                                            background: user?.role === 'ADMIN'
                                                ? alpha('#ff6b6b', 0.2)
                                                : alpha('#84cc16', 0.2),
                                            color: user?.role === 'ADMIN' ? '#ff6b6b' : '#84cc16',
                                        }}
                                    />
                                </Box>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    size="small"
                                >
                                    Logout
                                </Button>
                            </Box>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {drawer}
            </Drawer>

            <Toolbar /> {/* Spacer for fixed AppBar */}
        </>
    );
};

export default Navbar;
