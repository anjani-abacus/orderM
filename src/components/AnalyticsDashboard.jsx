import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    Card,
    CardContent
} from '@mui/material';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useOrdersByDate, useOrdersByStatus, useOrdersByUser } from '../hooks/useOrders';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042'];

const statusColors = {
    PENDING: '#ffc107',
    CONFIRMED: '#2196f3',
    SHIPPED: '#4caf50',
    CANCELLED: '#f44336',
};

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState(30);

    const { ordersByDate, loading: loadingDate, error: errorDate } = useOrdersByDate(dateRange);
    const { ordersByStatus, loading: loadingStatus, error: errorStatus } = useOrdersByStatus();
    const { ordersByUser, loading: loadingUser, error: errorUser } = useOrdersByUser(10);

    // const loading = loadingDate || loadingStatus || loadingUser;
    const error = errorDate || errorStatus || errorUser;

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load analytics: {error.message}
            </Alert>
        );
    }

    // Calculate totals for summary cards
    const totalOrders = ordersByDate.reduce((sum, d) => sum + d.count, 0);
    const totalRevenue = ordersByDate.reduce((sum, d) => sum + d.revenue, 0);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
                📊 Advanced Analytics
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Orders ({dateRange}d)</Typography>
                            <Typography variant="h4" fontWeight="bold">{totalOrders}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Revenue ({dateRange}d)</Typography>
                            <Typography variant="h4" fontWeight="bold">₹{totalRevenue.toLocaleString()}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Date Range Toggle */}
            <Box sx={{ mb: 3 }}>
                <ToggleButtonGroup
                    value={dateRange}
                    exclusive
                    onChange={(e, val) => val && setDateRange(val)}
                    size="small"
                >
                    <ToggleButton value={7}>7 Days</ToggleButton>
                    <ToggleButton value={14}>14 Days</ToggleButton>
                    <ToggleButton value={30}>30 Days</ToggleButton>
                    <ToggleButton value={90}>90 Days</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid container spacing={3}>
                {/* Orders Over Time - Line Chart */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📈 Orders Over Time
                        </Typography>
                        {loadingDate ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={ordersByDate}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                                            name === 'revenue' ? 'Revenue' : 'Orders'
                                        ]}
                                        labelFormatter={(val) => new Date(val).toLocaleDateString('en-IN')}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Orders"
                                        dot={{ r: 4 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="Revenue"
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>

                {/* Orders by Status - Pie Chart */}
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            🥧 Orders by Status
                        </Typography>
                        {loadingStatus ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={ordersByStatus}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ status, percent }) => `${status} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {ordersByStatus.map((entry, index) => (
                                            <Cell key={entry.status} fill={statusColors[entry.status] || COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [value, 'Orders']} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>

                {/* Top Users - Bar Chart */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: 400 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            👥 Top Users by Orders
                        </Typography>
                        {loadingUser ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ordersByUser} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="userName" type="category" width={150} />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                                            name === 'revenue' ? 'Revenue' : 'Orders'
                                        ]}
                                    />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" name="Orders" />
                                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
