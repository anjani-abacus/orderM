import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Container,
    alpha,
} from '@mui/material';
import ClientDetailsStep from './steps/ClientDetailsStep';
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import OrderSummary from './OrderSummary';
import Navbar from '../components/Navbar';
import GlowCard from '../components/GlowCard';

const steps = ['Client & Company Details', 'Service Selection & Campaign'];

const OrderForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        // Step 1: Client Details
        companyName: '',
        websiteUrl: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        billingAddress: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        representativeName: '',
        representativeEmail: '',
        // Step 2: Service Selection
        serviceId: '',
        packageId: '',
        comments: '',
        campaignStartDate: '',
        campaignDuration: 1,
        monthlyCharges: 0,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedOrder, setSubmittedOrder] = useState(null);

    const handleNext = (stepData) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = (stepData, order) => {
        setFormData((prev) => ({ ...prev, ...stepData }));
        setSubmittedOrder(order);
        setIsSubmitted(true);
    };

    const handleNewOrder = () => {
        setFormData({
            companyName: '',
            websiteUrl: '',
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            billingAddress: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            representativeName: '',
            representativeEmail: '',
            serviceId: '',
            packageId: '',
            comments: '',
            campaignStartDate: '',
            campaignDuration: 1,
            monthlyCharges: 0,
        });
        setActiveStep(0);
        setIsSubmitted(false);
        setSubmittedOrder(null);
    };

    if (isSubmitted && submittedOrder) {
        return (
            <>
                <Navbar />
                <OrderSummary order={submittedOrder} onNewOrder={handleNewOrder} />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
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
                        Create New Order
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Fill in the details to create a new order
                    </Typography>
                </Box>

                <GlowCard sx={{ mb: 4 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            '& .MuiStepConnector-line': {
                                borderColor: alpha('#00f5ff', 0.3),
                            },
                            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                                borderColor: '#00f5ff',
                            },
                            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                                borderColor: '#2ed573',
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </GlowCard>

                <GlowCard>
                    {activeStep === 0 && (
                        <ClientDetailsStep
                            formData={formData}
                            onNext={handleNext}
                        />
                    )}
                    {activeStep === 1 && (
                        <ServiceSelectionStep
                            formData={formData}
                            onBack={handleBack}
                            onSubmit={handleSubmit}
                        />
                    )}
                </GlowCard>
            </Container>
        </>
    );
};

export default OrderForm;
