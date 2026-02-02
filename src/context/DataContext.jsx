import { createContext, useState } from 'react';
import servicesData from '../mock-data/services.json';
import packagesData from '../mock-data/packages.json';
import activitiesData from '../mock-data/activities.json';
import ordersData from '../mock-data/orders.json';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    // Initialize state directly with imported data to avoid cascading renders
    const [services, setServices] = useState(servicesData);
    const [packages, setPackages] = useState(packagesData);
    const [activities, setActivities] = useState(activitiesData);
    const [orders, setOrders] = useState(ordersData);

    // Get packages by service ID
    const getPackagesByService = (serviceId) => {
        return packages.filter((pkg) => pkg.serviceId === serviceId);
    };

    // Get activities by package ID
    const getActivitiesByPackage = (packageId) => {
        return activities.filter((act) => act.packageId === packageId);
    };

    // Get service by ID
    const getServiceById = (serviceId) => {
        return services.find((svc) => svc.id === serviceId);
    };

    // Get package by ID
    const getPackageById = (packageId) => {
        return packages.find((pkg) => pkg.id === packageId);
    };

    // --- Service CRUD ---
    const addService = (service) => {
        const newService = {
            ...service,
            id: `svc-${Date.now()}`,
        };
        setServices((prev) => [...prev, newService]);
        return newService;
    };

    const updateService = (id, updates) => {
        setServices((prev) =>
            prev.map((svc) => (svc.id === id ? { ...svc, ...updates } : svc))
        );
    };

    const deleteService = (id) => {
        setServices((prev) => prev.filter((svc) => svc.id !== id));
        // Also delete related packages and activities
        const relatedPackages = packages.filter((pkg) => pkg.serviceId === id);
        relatedPackages.forEach((pkg) => deletePackage(pkg.id));
    };

    // --- Package CRUD ---
    const addPackage = (pkg) => {
        const newPackage = {
            ...pkg,
            id: `pkg-${Date.now()}`,
        };
        setPackages((prev) => [...prev, newPackage]);
        return newPackage;
    };

    const updatePackage = (id, updates) => {
        setPackages((prev) =>
            prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
        );
    };

    const deletePackage = (id) => {
        setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
        // Also delete related activities
        setActivities((prev) => prev.filter((act) => act.packageId !== id));
    };

    // --- Activity CRUD ---
    const addActivity = (activity) => {
        const newActivity = {
            ...activity,
            id: `act-${Date.now()}`,
        };
        setActivities((prev) => [...prev, newActivity]);
        return newActivity;
    };

    const updateActivity = (id, updates) => {
        setActivities((prev) =>
            prev.map((act) => (act.id === id ? { ...act, ...updates } : act))
        );
    };

    const deleteActivity = (id) => {
        setActivities((prev) => prev.filter((act) => act.id !== id));
    };

    // --- Order Management ---
    const addOrder = (orderData) => {
        const newOrder = {
            ...orderData,
            id: `order-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'CREATED',
        };
        setOrders((prev) => [...prev, newOrder]);
        return newOrder;
    };

    const getOrders = () => orders;

    const value = {
        // Data
        services,
        packages,
        activities,
        orders,

        // Getters
        getPackagesByService,
        getActivitiesByPackage,
        getServiceById,
        getPackageById,
        getOrders,

        // Service CRUD
        addService,
        updateService,
        deleteService,

        // Package CRUD
        addPackage,
        updatePackage,
        deletePackage,

        // Activity CRUD
        addActivity,
        updateActivity,
        deleteActivity,

        // Order
        addOrder,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
