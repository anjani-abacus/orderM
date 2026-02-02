import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Tooltip,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Assignment,
} from '@mui/icons-material';
import { useData } from '../context/useData';
import { activitySchema } from '../utils/validation';
import Navbar from '../components/Navbar';
import GlowCard from '../components/GlowCard';

const ManageActivities = () => {
    const { packages, activities, addActivity, updateActivity, deleteActivity, getPackageById, getServiceById } = useData();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(activitySchema),
    });

    const handleOpenDialog = (activity = null) => {
        setEditingActivity(activity);
        if (activity) {
            reset({
                packageId: activity.packageId,
                name: activity.name,
                description: activity.description,
            });
        } else {
            reset({
                packageId: '',
                name: '',
                description: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingActivity(null);
        reset();
    };

    const onSubmit = (data) => {
        if (editingActivity) {
            updateActivity(editingActivity.id, data);
        } else {
            addActivity(data);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        deleteActivity(id);
        setDeleteConfirm(null);
    };

    const getPackageWithService = (packageId) => {
        const pkg = getPackageById(packageId);
        if (!pkg) return { packageName: '-', serviceName: '-' };
        const service = getServiceById(pkg.serviceId);
        return {
            packageName: pkg.name,
            serviceName: service?.name || '-',
        };
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            Manage Activities
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Add, edit, or remove activities
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Activity
                    </Button>
                </Box>

                <GlowCard sx={{ p: 0, overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Package</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.map((activity) => {
                                    const { packageName, serviceName } = getPackageWithService(activity.packageId);
                                    return (
                                        <TableRow key={activity.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Assignment sx={{ color: '#00f5ff', fontSize: 20 }} />
                                                    <Typography fontWeight={500}>{activity.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{packageName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {serviceName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        maxWidth: 250,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {activity.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() => handleOpenDialog(activity)}
                                                        sx={{ color: '#00f5ff' }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => setDeleteConfirm(activity)}
                                                        sx={{ color: '#ff4757' }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {activities.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No activities found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </GlowCard>

                {/* Add/Edit Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                                <Controller
                                    name="packageId"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.packageId}>
                                            <InputLabel>Package</InputLabel>
                                            <Select {...field} label="Package">
                                                {packages.map((pkg) => {
                                                    const service = getServiceById(pkg.serviceId);
                                                    return (
                                                        <MenuItem key={pkg.id} value={pkg.id}>
                                                            {pkg.name} ({service?.name})
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                            {errors.packageId && (
                                                <FormHelperText>{errors.packageId.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <TextField
                                    {...register('name')}
                                    label="Activity Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                                <TextField
                                    {...register('description')}
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleCloseDialog} variant="outlined">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                {editingActivity ? 'Update' : 'Add'} Activity
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={!!deleteConfirm}
                    onClose={() => setDeleteConfirm(null)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete "{deleteConfirm?.name}"?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setDeleteConfirm(null)} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleDelete(deleteConfirm.id)}
                            variant="contained"
                            color="error"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default ManageActivities;
