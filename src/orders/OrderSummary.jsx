import { useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    alpha,
    Alert,
} from '@mui/material';
import {
    CheckCircle,
    Download,
    Add,
    Print,
    Business,
    Person,
    LocationOn,
    Category,
    CalendarMonth,
} from '@mui/icons-material';
import GlowCard from '../components/GlowCard';

const OrderSummary = ({ order, onNewOrder }) => {
    const printRef = useRef(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
      <html>
        <head>
          <title>Order Summary - ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #333;
            }
            h1 {
              color: #65a30d;
              border-bottom: 2px solid #84cc16;
              padding-bottom: 10px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #65a30d;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .field {
              margin-bottom: 10px;
            }
            .label {
              font-size: 12px;
              color: #666;
              margin-bottom: 4px;
            }
            .value {
              font-size: 14px;
              font-weight: 500;
            }
            .total {
              font-size: 24px;
              color: #65a30d;
              font-weight: bold;
            }
            .activity-list {
              list-style: none;
              padding: 0;
            }
            .activity-list li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .activity-list li:before {
              content: "✓";
              color: #2ed573;
              font-weight: bold;
            }
            .chip {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 16px;
              font-size: 12px;
              font-weight: 500;
              background: #e3f2fd;
              color: #65a30d;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Order Summary</h1>
          <p>Order ID: ${order.id}</p>
          <p>Created: ${new Date(order.createdAt).toLocaleString()}</p>
          
          <div class="section">
            <div class="section-title">Company Details</div>
            <div class="grid">
              <div class="field">
                <div class="label">Company Name</div>
                <div class="value">${order.companyName}</div>
              </div>
              <div class="field">
                <div class="label">Website</div>
                <div class="value">${order.websiteUrl}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Client Details</div>
            <div class="grid">
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value">${order.clientName}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value">${order.clientEmail}</div>
              </div>
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">${order.clientPhone}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Billing Address</div>
            <p>${order.billingAddress}</p>
            <p>${order.city}, ${order.state}, ${order.country} - ${order.zipCode}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Service Details</div>
            <div class="grid">
              <div class="field">
                <div class="label">Service</div>
                <div class="value">${order.serviceName}</div>
              </div>
              <div class="field">
                <div class="label">Package</div>
                <div class="value">${order.packageName} <span class="chip">${order.packageTier}</span></div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Activities Included</div>
            <ul class="activity-list">
              ${order.activities?.map(a => `<li>${a.name}</li>`).join('') || ''}
            </ul>
          </div>
          
          <div class="section">
            <div class="section-title">Campaign Details</div>
            <div class="grid">
              <div class="field">
                <div class="label">Start Date</div>
                <div class="value">${new Date(order.campaignStartDate).toLocaleDateString()}</div>
              </div>
              <div class="field">
                <div class="label">Duration</div>
                <div class="value">${order.campaignDuration} months</div>
              </div>
              <div class="field">
                <div class="label">Monthly Charges</div>
                <div class="value">₹${order.monthlyCharges?.toLocaleString('en-IN')}</div>
              </div>
              <div class="field">
                <div class="label">Total Amount</div>
                <div class="total">₹${order.totalAmount?.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
          
          ${order.comments ? `
          <div class="section">
            <div class="section-title">Notes</div>
            <p>${order.comments}</p>
          </div>
          ` : ''}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    const InfoField = ({ label, value }) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={500}>
                {value}
            </Typography>
        </Box>
    );

    const SectionHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ color: '#84cc16' }}>
                {title}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert
                severity="success"
                icon={<CheckCircle />}
                sx={{
                    mb: 4,
                    background: alpha('#2ed573', 0.1),
                    border: `1px solid ${alpha('#2ed573', 0.3)}`,
                    '& .MuiAlert-icon': {
                        color: '#2ed573',
                    },
                }}
            >
                <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    Order Created Successfully!
                </Typography>
                <Typography variant="body2">
                    Order ID: {order.id}
                </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Order Summary
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Print />}
                        onClick={handlePrint}
                    >
                        Download PDF
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onNewOrder}
                    >
                        New Order
                    </Button>
                </Box>
            </Box>

            <div ref={printRef}>
                <Grid container spacing={3}>
                    {/* Company Details */}
                    <Grid item xs={12} md={6}>
                        <GlowCard>
                            <SectionHeader
                                icon={<Business sx={{ color: '#84cc16' }} />}
                                title="Company Details"
                            />
                            <InfoField label="Company Name" value={order.companyName} />
                            <InfoField label="Website" value={order.websiteUrl} />
                        </GlowCard>
                    </Grid>

                    {/* Client Details */}
                    <Grid item xs={12} md={6}>
                        <GlowCard>
                            <SectionHeader
                                icon={<Person sx={{ color: '#84cc16' }} />}
                                title="Client Details"
                            />
                            <InfoField label="Client Name" value={order.clientName} />
                            <InfoField label="Email" value={order.clientEmail} />
                            <InfoField label="Phone" value={order.clientPhone} />
                        </GlowCard>
                    </Grid>

                    {/* Billing Address */}
                    <Grid item xs={12} md={6}>
                        <GlowCard>
                            <SectionHeader
                                icon={<LocationOn sx={{ color: '#84cc16' }} />}
                                title="Billing Address"
                            />
                            <Typography variant="body1">{order.billingAddress}</Typography>
                            <Typography variant="body1">
                                {order.city}, {order.state}, {order.country} - {order.zipCode}
                            </Typography>
                            <Divider sx={{ my: 2, borderColor: alpha('#84cc16', 0.2) }} />
                            <InfoField label="Representative" value={order.representativeName} />
                            <InfoField label="Representative Email" value={order.representativeEmail} />
                        </GlowCard>
                    </Grid>

                    {/* Service Details */}
                    <Grid item xs={12} md={6}>
                        <GlowCard>
                            <SectionHeader
                                icon={<Category sx={{ color: '#84cc16' }} />}
                                title="Service Details"
                            />
                            <InfoField label="Service" value={order.serviceName} />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Package
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body1" fontWeight={500}>
                                        {order.packageName}
                                    </Typography>
                                    <Chip
                                        label={order.packageTier}
                                        size="small"
                                        sx={{
                                            background: alpha('#84cc16', 0.2),
                                            color: '#84cc16',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </GlowCard>
                    </Grid>

                    {/* Activities */}
                    <Grid item xs={12}>
                        <GlowCard>
                            <SectionHeader
                                icon={<CheckCircle sx={{ color: '#84cc16' }} />}
                                title="Activities Included"
                            />
                            <Grid container spacing={2}>
                                {order.activities?.map((activity) => (
                                    <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 1,
                                                p: 1.5,
                                                borderRadius: 1,
                                                background: alpha('#84cc16', 0.05),
                                            }}
                                        >
                                            <CheckCircle sx={{ color: '#2ed573', fontSize: 20, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {activity.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {activity.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </GlowCard>
                    </Grid>

                    {/* Campaign Details */}
                    <Grid item xs={12}>
                        <GlowCard glowColor="#2ed573" intensity={0.2}>
                            <SectionHeader
                                icon={<CalendarMonth sx={{ color: '#2ed573' }} />}
                                title="Campaign Details"
                            />
                            <Grid container spacing={3}>
                                <Grid item xs={6} sm={3}>
                                    <InfoField
                                        label="Start Date"
                                        value={new Date(order.campaignStartDate).toLocaleDateString()}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <InfoField label="Duration" value={`${order.campaignDuration} months`} />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <InfoField
                                        label="Monthly Charges"
                                        value={`₹${order.monthlyCharges?.toLocaleString('en-IN')}`}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Total Amount
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            color: '#2ed573',
                                            fontWeight: 700,
                                            textShadow: '0 0 15px rgba(46,213,115,0.4)',
                                        }}
                                    >
                                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {order.comments && (
                                <>
                                    <Divider sx={{ my: 3, borderColor: alpha('#2ed573', 0.2) }} />
                                    <InfoField label="Notes / Comments" value={order.comments} />
                                </>
                            )}
                        </GlowCard>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
};

export default OrderSummary;
