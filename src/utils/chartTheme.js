// Chart theme configuration matching the existing neon cyan/blue theme
export const chartColors = {
    primary: '#84cc16',
    secondary: '#65a30d',
    success: '#2ed573',
    warning: '#ffa502',
    error: '#ff4757',
    background: '#12121a',
    surface: '#1a1a2e',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    grid: 'rgba(0, 245, 255, 0.1)',
};

// Status color mapping
export const statusColors = {
    CREATED: '#65a30d',
    IN_PROGRESS: '#ffa502',
    COMPLETED: '#2ed573',
    CANCELLED: '#ff4757',
    ON_HOLD: '#9c88ff',
};

// Status labels
export const statusLabels = {
    CREATED: 'Created',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'On Hold',
};

// Priority colors
export const priorityColors = {
    HIGH: '#ff4757',
    MEDIUM: '#ffa502',
    LOW: '#2ed573',
};

// Chart tooltip styles
export const tooltipStyle = {
    contentStyle: {
        backgroundColor: 'rgba(18, 18, 26, 0.95)',
        border: '1px solid rgba(0, 245, 255, 0.3)',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
    },
    labelStyle: {
        color: '#84cc16',
        fontWeight: 600,
    },
    itemStyle: {
        color: '#ffffff',
    },
};

// Area chart gradient definitions
export const areaGradient = {
    id: 'areaGradient',
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
    stops: [
        { offset: '0%', color: '#84cc16', opacity: 0.4 },
        { offset: '100%', color: '#84cc16', opacity: 0 },
    ],
};

// Format currency in Indian Rupees
export const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
};

// Format percentage
export const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
};

// Format date for charts
export const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });
};

// Format short date
export const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

export default chartColors;
