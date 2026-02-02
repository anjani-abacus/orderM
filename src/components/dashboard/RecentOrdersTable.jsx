import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TableSortLabel,
    alpha,
    TablePagination,
} from '@mui/material';
import { Visibility, MoreVert } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { statusColors, statusLabels, chartColors, formatCurrency, formatShortDate } from '../../utils/chartTheme';

const RecentOrdersTable = ({ orders }) => {
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => {
            let aVal = a[orderBy];
            let bVal = b[orderBy];

            if (orderBy === 'createdAt' || orderBy === 'dueDate') {
                aVal = new Date(aVal || 0);
                bVal = new Date(bVal || 0);
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [orders, orderBy, order]);

    const paginatedOrders = useMemo(() => {
        return sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedOrders, page, rowsPerPage]);

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
                overflow: 'hidden',
            }}
        >
            <Typography variant="h6" sx={{ color: chartColors.primary, fontWeight: 600, mb: 2 }}>
                Recent Orders
            </Typography>

            <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                <TableSortLabel
                                    active={orderBy === 'companyName'}
                                    direction={orderBy === 'companyName' ? order : 'asc'}
                                    onClick={() => handleSort('companyName')}
                                    sx={{ color: chartColors.primary, '&.Mui-active': { color: chartColors.primary } }}
                                >
                                    Client
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                Service
                            </TableCell>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                <TableSortLabel
                                    active={orderBy === 'totalAmount'}
                                    direction={orderBy === 'totalAmount' ? order : 'asc'}
                                    onClick={() => handleSort('totalAmount')}
                                    sx={{ color: chartColors.primary, '&.Mui-active': { color: chartColors.primary } }}
                                >
                                    Amount
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                Status
                            </TableCell>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderBy === 'createdAt' ? order : 'asc'}
                                    onClick={() => handleSort('createdAt')}
                                    sx={{ color: chartColors.primary, '&.Mui-active': { color: chartColors.primary } }}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ background: alpha(chartColors.primary, 0.1), borderBottom: `1px solid ${alpha(chartColors.primary, 0.3)}` }}>
                                Rep
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order) => (
                            <TableRow
                                key={order.id}
                                sx={{
                                    '&:hover': {
                                        background: alpha(chartColors.primary, 0.05),
                                    },
                                }}
                            >
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                                            {order.companyName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                                            {order.clientName}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                                        {order.serviceName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                                        {order.packageName}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Typography variant="body2" sx={{ color: chartColors.success, fontWeight: 600 }}>
                                        {formatCurrency(order.totalAmount)}
                                    </Typography>
                                    {order.paidAmount < order.totalAmount && (
                                        <Typography variant="caption" sx={{ color: chartColors.warning }}>
                                            Paid: {formatCurrency(order.paidAmount)}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Chip
                                        label={statusLabels[order.status] || order.status}
                                        size="small"
                                        sx={{
                                            background: alpha(statusColors[order.status] || '#888', 0.2),
                                            color: statusColors[order.status] || '#888',
                                            border: `1px solid ${alpha(statusColors[order.status] || '#888', 0.4)}`,
                                            fontWeight: 500,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                        {formatShortDate(order.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ borderBottom: `1px solid ${alpha('#fff', 0.1)}` }}>
                                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                                        {order.representative}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={orders.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{
                    color: alpha('#fff', 0.7),
                    borderTop: `1px solid ${alpha(chartColors.primary, 0.2)}`,
                    '& .MuiTablePagination-selectIcon': { color: alpha('#fff', 0.5) },
                }}
            />
        </Box>
    );
};

export default RecentOrdersTable;
