import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    alpha,
} from '@mui/material';
import { ArrowForward, Business, Person, LocationOn } from '@mui/icons-material';
import { clientDetailsSchema } from '../../utils/validation';

const ClientDetailsStep = ({ formData, onNext }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(clientDetailsSchema),
        defaultValues: {
            companyName: formData.companyName,
            websiteUrl: formData.websiteUrl,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            billingAddress: formData.billingAddress,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
            representativeName: formData.representativeName,
            representativeEmail: formData.representativeEmail,
        },
    });

    const onSubmit = (data) => {
        onNext(data);
    };

    const SectionHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ color: '#00f5ff' }}>
                {title}
            </Typography>
        </Box>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Details */}
            <SectionHeader
                icon={<Business sx={{ color: '#00f5ff' }} />}
                title="Company Details"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register('companyName')}
                        label="Company Name"
                        fullWidth
                        error={!!errors.companyName}
                        helperText={errors.companyName?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register('websiteUrl')}
                        label="Website URL"
                        fullWidth
                        placeholder="https://example.com"
                        error={!!errors.websiteUrl}
                        helperText={errors.websiteUrl?.message}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: alpha('#00f5ff', 0.2) }} />

            {/* Client Details */}
            <SectionHeader
                icon={<Person sx={{ color: '#00f5ff' }} />}
                title="Client Details"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        {...register('clientName')}
                        label="Client Name"
                        fullWidth
                        error={!!errors.clientName}
                        helperText={errors.clientName?.message}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        {...register('clientEmail')}
                        label="Client Email"
                        type="email"
                        fullWidth
                        error={!!errors.clientEmail}
                        helperText={errors.clientEmail?.message}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        {...register('clientPhone')}
                        label="Client Phone"
                        fullWidth
                        error={!!errors.clientPhone}
                        helperText={errors.clientPhone?.message}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: alpha('#00f5ff', 0.2) }} />

            {/* Billing Address */}
            <SectionHeader
                icon={<LocationOn sx={{ color: '#00f5ff' }} />}
                title="Billing Address"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <TextField
                        {...register('billingAddress')}
                        label="Billing Address"
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.billingAddress}
                        helperText={errors.billingAddress?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        {...register('city')}
                        label="City"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        {...register('state')}
                        label="State"
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        {...register('country')}
                        label="Country"
                        fullWidth
                        error={!!errors.country}
                        helperText={errors.country?.message}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        {...register('zipCode')}
                        label="Zip Code"
                        fullWidth
                        error={!!errors.zipCode}
                        helperText={errors.zipCode?.message}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: alpha('#00f5ff', 0.2) }} />

            {/* Representative Details */}
            <SectionHeader
                icon={<Person sx={{ color: '#00f5ff' }} />}
                title="Representative Details"
            />
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register('representativeName')}
                        label="Representative Name"
                        fullWidth
                        error={!!errors.representativeName}
                        helperText={errors.representativeName?.message}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        {...register('representativeEmail')}
                        label="Representative Email"
                        type="email"
                        fullWidth
                        error={!!errors.representativeEmail}
                        helperText={errors.representativeEmail?.message}
                    />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                >
                    Next: Service Selection
                </Button>
            </Box>
        </form>
    );
};

export default ClientDetailsStep;
