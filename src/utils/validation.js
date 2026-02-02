import { z } from 'zod';

export const clientDetailsSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    websiteUrl: z
        .string()
        .min(1, 'Website URL is required')
        .url('Please enter a valid URL'),
    clientName: z.string().min(1, 'Client name is required'),
    clientEmail: z
        .string()
        .min(1, 'Client email is required')
        .email('Please enter a valid email'),
    clientPhone: z
        .string()
        .min(1, 'Phone number is required')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits'),
    billingAddress: z.string().min(1, 'Billing address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    representativeName: z.string().min(1, 'Representative name is required'),
    representativeEmail: z
        .string()
        .min(1, 'Representative email is required')
        .email('Please enter a valid email'),
});

export const serviceSelectionSchema = z.object({
    serviceId: z.string().min(1, 'Please select a service'),
    packageId: z.string().min(1, 'Please select a package'),
    comments: z.string().optional(),
    campaignStartDate: z.string().min(1, 'Campaign start date is required'),
    campaignDuration: z
        .number({ invalid_type_error: 'Please enter campaign duration' })
        .min(1, 'Duration must be at least 1 month')
        .max(36, 'Duration cannot exceed 36 months'),
    monthlyCharges: z
        .number({ invalid_type_error: 'Please enter monthly charges' })
        .min(1, 'Monthly charges must be greater than 0'),
});

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

export const serviceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().optional(),
});

export const packageSchema = z.object({
    serviceId: z.string().min(1, 'Please select a service'),
    name: z.string().min(1, 'Package name is required'),
    tier: z.enum(['Basic', 'Standard', 'Premium'], {
        errorMap: () => ({ message: 'Please select a tier' }),
    }),
    price: z
        .number({ invalid_type_error: 'Please enter a price' })
        .min(1, 'Price must be greater than 0'),
    description: z.string().min(1, 'Description is required'),
});

export const activitySchema = z.object({
    packageId: z.string().min(1, 'Please select a package'),
    name: z.string().min(1, 'Activity name is required'),
    description: z.string().min(1, 'Description is required'),
});
