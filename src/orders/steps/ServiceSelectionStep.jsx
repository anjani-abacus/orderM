import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    alpha,
    InputAdornment,
} from '@mui/material';
import {
    ArrowBack,
    Check,
    CheckCircle,
    Category,
    Inventory,
    CalendarMonth,
    CurrencyRupee,
    Notes,
} from '@mui/icons-material';
import { useData } from '../../context/useData';
import { serviceSelectionSchema } from '../../utils/validation';

const ServiceSelectionStep = ({ formData, onBack, onSubmit }) => {
    const { services, getPackagesByService, getActivitiesByPackage, getServiceById, getPackageById, addOrder } = useData();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(serviceSelectionSchema),
        defaultValues: {
            serviceId: formData.serviceId,
            packageId: formData.packageId,
            comments: formData.comments || '',
            campaignStartDate: formData.campaignStartDate,
            campaignDuration: formData.campaignDuration || 1,
            monthlyCharges: formData.monthlyCharges || 0,
        },
    });

    const selectedServiceId = watch('serviceId');
    const selectedPackageId = watch('packageId');

    const availablePackages = selectedServiceId ? getPackagesByService(selectedServiceId) : [];
    const activities = selectedPackageId ? getActivitiesByPackage(selectedPackageId) : [];
    const selectedPackage = selectedPackageId ? getPackageById(selectedPackageId) : null;

    // Reset package when service changes
    useEffect(() => {
        if (selectedServiceId && formData.serviceId !== selectedServiceId) {
            setValue('packageId', '');
        }
    }, [selectedServiceId, formData.serviceId, setValue]);

    // Set monthly charges when package is selected
    useEffect(() => {
        if (selectedPackage) {
            setValue('monthlyCharges', selectedPackage.price);
        }
    }, [selectedPackage, setValue]);

    const handleFormSubmit = (data) => {
        const service = getServiceById(data.serviceId);
        const pkg = getPackageById(data.packageId);
        const packageActivities = getActivitiesByPackage(data.packageId);

        const orderData = {
            ...formData,
            ...data,
            serviceName: service?.name,
            packageName: pkg?.name,
            packageTier: pkg?.tier,
            activities: packageActivities,
            totalAmount: data.monthlyCharges * data.campaignDuration,
        };

        const order = addOrder(orderData);
        onSubmit(data, order);
    };

    const SectionHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ color: '#84cc16' }}>
                {title}
            </Typography>
        </Box>
    );

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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Service Selection */}
            <SectionHeader
                icon={<Category sx={{ color: '#84cc16' }} />}
                title="Select Service"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
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
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="packageId"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.packageId} disabled={!selectedServiceId}>
                                <InputLabel>Package</InputLabel>
                                <Select {...field} label="Package">
                                    {availablePackages.map((pkg) => (
                                        <MenuItem key={pkg.id} value={pkg.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                <span>{pkg.name}</span>
                                                <Chip
                                                    label={pkg.tier}
                                                    size="small"
                                                    sx={{
                                                        ml: 'auto',
                                                        background: alpha(getTierColor(pkg.tier), 0.2),
                                                        color: getTierColor(pkg.tier),
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                                <span style={{ color: '#84cc16', marginLeft: 8 }}>
                                                    ₹{pkg.price.toLocaleString('en-IN')}
                                                </span>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.packageId && (
                                    <FormHelperText>{errors.packageId.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
            </Grid>

            {/* Activities Display */}
            {activities.length > 0 && (
                <>
                    <SectionHeader
                        icon={<Inventory sx={{ color: '#84cc16' }} />}
                        title="Package Activities"
                    />
                    <Box
                        sx={{
                            mb: 4,
                            p: 2,
                            borderRadius: 2,
                            background: alpha('#84cc16', 0.05),
                            border: `1px solid ${alpha('#84cc16', 0.2)}`,
                        }}
                    >
                        <List dense>
                            {activities.map((activity) => (
                                <ListItem key={activity.id}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <CheckCircle sx={{ color: '#2ed573', fontSize: 20 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={activity.name}
                                        secondary={activity.description}
                                        primaryTypographyProps={{ fontWeight: 500 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </>
            )}

            <Divider sx={{ my: 4, borderColor: alpha('#84cc16', 0.2) }} />

            {/* Campaign Details */}
            <SectionHeader
                icon={<CalendarMonth sx={{ color: '#84cc16' }} />}
                title="Campaign Details"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <TextField
                        {...register('comments')}
                        label="Comments / Notes"
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Add any special requirements or notes..."
                        error={!!errors.comments}
                        helperText={errors.comments?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        {...register('campaignStartDate')}
                        label="Campaign Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.campaignStartDate}
                        helperText={errors.campaignStartDate?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Controller
                        name="campaignDuration"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Campaign Duration"
                                type="number"
                                fullWidth
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">months</InputAdornment>,
                                }}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                error={!!errors.campaignDuration}
                                helperText={errors.campaignDuration?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Controller
                        name="monthlyCharges"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Monthly Charges"
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
                                error={!!errors.monthlyCharges}
                                helperText={errors.monthlyCharges?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* Order Summary Preview */}
            {selectedPackage && watch('campaignDuration') > 0 && (
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        background: alpha('#84cc16', 0.1),
                        border: `1px solid ${alpha('#84cc16', 0.3)}`,
                        mb: 4,
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#84cc16', mb: 2 }}>
                        Order Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Monthly Charges
                            </Typography>
                            <Typography variant="h6">
                                ₹{watch('monthlyCharges')?.toLocaleString('en-IN') || 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                                Duration
                            </Typography>
                            <Typography variant="h6">
                                {watch('campaignDuration')} months
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Total Amount
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: '#84cc16',
                                    fontWeight: 700,
                                    textShadow: '0 0 10px rgba(0,245,255,0.3)',
                                }}
                            >
                                ₹{((watch('monthlyCharges') || 0) * (watch('campaignDuration') || 0)).toLocaleString('en-IN')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    endIcon={<Check />}
                >
                    {isSubmitting ? 'Creating Order...' : 'Create Order'}
                </Button>
            </Box>
        </form>
    );
};

export default ServiceSelectionStep;
