import { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useOrders } from '../hooks/useOrders';

const statusColors = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    SHIPPED: 'success',
    CANCELLED: 'error',
};

const columns = [
    {
        field: 'orderNo',
        headerName: 'Order No',
        width: 150,
        renderCell: (params) => (
            <Typography fontWeight="medium">{params.value}</Typography>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => (
            <Chip
                label={params.value}
                color={statusColors[params.value] || 'default'}
                size="small"
                sx={{ fontWeight: 500 }}
            />
        )
    },
    {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        valueFormatter: (value) => `₹${value?.toLocaleString() || 0}`,
        renderCell: (params) => (
            <Typography fontWeight="bold" color="primary.main">
                ₹{params.value?.toLocaleString() || 0}
            </Typography>
        )
    },
    {
        field: 'user',
        headerName: 'Customer',
        width: 180,
        valueGetter: (value) => value?.name || 'Unknown',
    },
    {
        field: 'createdAt',
        headerName: 'Date',
        width: 180,
        valueFormatter: (value) => {
            if (!value) return '-';
            return new Date(value).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    },
];

export default function OrdersTable() {
    const { orders, loading, error, refetch } = useOrders();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load orders: {error.message}
            </Alert>
        );
    }

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Orders
                </Typography>
                <Tooltip title="Refresh">
                    <IconButton onClick={() => refetch()} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <DataGrid
                rows={orders}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'background.paper',
                        borderBottom: 2,
                        borderColor: 'primary.main',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
                slots={{
                    loadingOverlay: () => (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ),
                }}
            />
        </Box>
    );
}
