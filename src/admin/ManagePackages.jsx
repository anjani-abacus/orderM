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
    Chip,
    alpha,
    Tooltip,
    InputAdornment,
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Inventory,
    CurrencyRupee,
} from '@mui/icons-material';
import { useData } from '../context/useData';
import { packageSchema } from '../utils/validation';
import Navbar from '../components/Navbar';
import GlowCard from '../components/GlowCard';

const ManagePackages = () => {
    const { services, packages, addPackage, updatePackage, deletePackage, getServiceById } = useData();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(packageSchema),
    });

    const handleOpenDialog = (pkg = null) => {
        setEditingPackage(pkg);
        if (pkg) {
            reset({
                serviceId: pkg.serviceId,
                name: pkg.name,
                tier: pkg.tier,
                price: pkg.price,
                description: pkg.description,
            });
        } else {
            reset({
                serviceId: '',
                name: '',
                tier: 'Basic',
                price: 0,
                description: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPackage(null);
        reset();
    };

    const onSubmit = (data) => {
        if (editingPackage) {
            updatePackage(editingPackage.id, data);
        } else {
            addPackage(data);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        deletePackage(id);
        setDeleteConfirm(null);
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Basic':
                return '#2ed573';
            case 'Standard':
                return '#84cc16';
            case 'Premium':
                return '#ffa502';
            default:
                return '#84cc16';
        }
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
                            Manage Packages
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Add, edit, or remove packages
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Package
                    </Button>
                </Box>

                <GlowCard sx={{ p: 0, overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Tier</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {packages.map((pkg) => {
                                    const service = getServiceById(pkg.serviceId);
                                    return (
                                        <TableRow key={pkg.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Inventory sx={{ color: '#84cc16', fontSize: 20 }} />
                                                    <Typography fontWeight={500}>{pkg.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{service?.name || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={pkg.tier}
                                                    size="small"
                                                    sx={{
                                                        background: alpha(getTierColor(pkg.tier), 0.2),
                                                        color: getTierColor(pkg.tier),
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{ color: '#2ed573', fontWeight: 500 }}>
                                                    ₹{pkg.price.toLocaleString('en-IN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {pkg.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Edit">
                                                    <IconButton
                                                        onClick={() => handleOpenDialog(pkg)}
                                                        sx={{ color: '#84cc16' }}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        onClick={() => setDeleteConfirm(pkg)}
                                                        sx={{ color: '#ff4757' }}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {packages.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No packages found</Typography>
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
                        {editingPackage ? 'Edit Package' : 'Add New Package'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                                <Controller
                                    name="serviceId"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.serviceId}>
                                            <InputLabel>Service</InputLabel>
                                            <Select {...field} label="Service">
                                                {services.map((service) => (
                                                    <MenuItem key={service.id} value={service.id}>
                                                        {service.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.serviceId && (
                                                <FormHelperText>{errors.serviceId.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <TextField
                                    {...register('name')}
                                    label="Package Name"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                                <Controller
                                    name="tier"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.tier}>
                                            <InputLabel>Tier</InputLabel>
                                            <Select {...field} label="Tier">
                                                <MenuItem value="Basic">Basic</MenuItem>
                                                <MenuItem value="Standard">Standard</MenuItem>
                                                <MenuItem value="Premium">Premium</MenuItem>
                                            </Select>
                                            {errors.tier && (
                                                <FormHelperText>{errors.tier.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Price"
                                            type="number"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CurrencyRupee sx={{ fontSize: 18 }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
                                        />
                                    )}
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
                                {editingPackage ? 'Update' : 'Add'} Package
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
                            This will also delete all related activities.
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

export default ManagePackages;
