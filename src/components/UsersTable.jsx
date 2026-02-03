import { useState } from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Alert, CircularProgress, Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useQuery } from '@apollo/client/react';
import { GET_USERS } from '../graphql/queries';

const roleColors = {
    ADMIN: 'error',
    USER: 'primary',
};

const columns = [
    {
        field: 'name',
        headerName: 'Name',
        width: 200,
        renderCell: (params) => (
            <Typography fontWeight="medium">{params.value}</Typography>
        )
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 250,
    },
    {
        field: 'role',
        headerName: 'Role',
        width: 120,
        renderCell: (params) => (
            <Chip
                label={params.value}
                color={roleColors[params.value] || 'default'}
                size="small"
                sx={{ fontWeight: 500 }}
            />
        )
    },
    {
        field: 'isActive',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
            <Chip
                label={params.value ? 'Active' : 'Inactive'}
                color={params.value ? 'success' : 'default'}
                size="small"
                variant={params.value ? 'filled' : 'outlined'}
            />
        )
    },
];

export default function UsersTable() {
    const { data, loading, error, refetch } = useQuery(GET_USERS);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const users = data?.users || [];

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load users: {error.message}
            </Alert>
        );
    }

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Users
                </Typography>
                <Tooltip title="Refresh">
                    <IconButton onClick={() => refetch()} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <DataGrid
                rows={users}
                columns={columns}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'background.paper',
                        borderBottom: 2,
                        borderColor: 'secondary.main',
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
