import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
    Tooltip,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Category,
} from '@mui/icons-material';
import { useData } from '../context/useData';
import { serviceSchema } from '../utils/validation';
import Navbar from '../components/Navbar';
import GlowCard from '../components/GlowCard';

const ManageServices = () => {
    const { services, addService, updateService, deleteService } = useData();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(serviceSchema),
    });

    const handleOpenDialog = (service = null) => {
        setEditingService(service);
        if (service) {
            reset({
                name: service.name,
                description: service.description,
                icon: service.icon || '',
            });
        } else {
            reset({
                name: '',
                description: '',
                icon: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        reset();
    };

    const onSubmit = (data) => {
        if (editingService) {
            updateService(editingService.id, data);
        } else {
            addService(data);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        deleteService(id);
        setDeleteConfirm(null);
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
                                background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            Manage Services
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Add, edit, or remove services
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Service
                    </Button>
                </Box>

                <GlowCard sx={{ p: 0, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Icon</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((service) => (
                                    <TableRow key={service.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Category sx={{ color: '#84cc16', fontSize: 20 }} />
                                                <Typography fontWeight={500}>{service.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                {service.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {service.icon || '-'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleOpenDialog(service)}
                                                    sx={{ color: '#84cc16' }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => setDeleteConfirm(service)}
                                                    sx={{ color: '#ff4757' }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {services.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No services found</Typography>
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
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                                <TextField
                                    {...register('name')}
                                    label="Service Name"
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
                                <TextField
                                    {...register('icon')}
                                    label="Icon Name (MUI Icon)"
                                    fullWidth
                                    placeholder="e.g., Search, Code, TrendingUp"
                                    error={!!errors.icon}
                                    helperText={errors.icon?.message || 'Optional: MUI icon name'}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleCloseDialog} variant="outlined">
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                {editingService ? 'Update' : 'Add'} Service
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
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            This will also delete all related packages and activities.
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

export default ManageServices;
