import { useQuery, useMutation } from '@apollo/client';
import {
    GET_ORDERS,
    GET_ORDER_STATS,
    GET_ORDERS_BY_DATE,
    GET_ORDERS_BY_STATUS,
    GET_ORDERS_BY_USER
} from '../graphql/queries';
import { CREATE_ORDER, UPDATE_ORDER_STATUS } from '../graphql/mutations';

// Hook for fetching orders
export function useOrders() {
    const { data, loading, error, refetch } = useQuery(GET_ORDERS);

    return {
        orders: data?.orders || [],
        loading,
        error,
        refetch,
    };
}

// Hook for order statistics
export function useOrderStats() {
    const { data, loading, error } = useQuery(GET_ORDER_STATS);

    return {
        stats: data?.orderStats || { totalOrders: 0, totalRevenue: 0 },
        loading,
        error,
    };
}

// Hook for creating orders
export function useCreateOrder() {
    const [createOrder, { loading, error }] = useMutation(CREATE_ORDER, {
        refetchQueries: [{ query: GET_ORDERS }, { query: GET_ORDER_STATS }],
    });

    return {
        createOrder: (input) => createOrder({ variables: { input } }),
        loading,
        error,
    };
}

// Hook for updating order status
export function useUpdateOrderStatus() {
    const [updateOrderStatus, { loading, error }] = useMutation(UPDATE_ORDER_STATUS, {
        refetchQueries: [{ query: GET_ORDERS }, { query: GET_ORDER_STATS }],
    });

    return {
        updateOrderStatus: (input) => updateOrderStatus({ variables: { input } }),
        loading,
        error,
    };
}

// Hook for advanced analytics - Orders by Date
export function useOrdersByDate(days = 30) {
    const { data, loading, error } = useQuery(GET_ORDERS_BY_DATE, {
        variables: { days },
    });

    return {
        ordersByDate: data?.ordersByDate || [],
        loading,
        error,
    };
}

// Hook for advanced analytics - Orders by Status
export function useOrdersByStatus() {
    const { data, loading, error } = useQuery(GET_ORDERS_BY_STATUS);

    return {
        ordersByStatus: data?.ordersByStatus || [],
        loading,
        error,
    };
}

// Hook for advanced analytics - Orders by User
export function useOrdersByUser(limit = 10) {
    const { data, loading, error } = useQuery(GET_ORDERS_BY_USER, {
        variables: { limit },
    });

    return {
        ordersByUser: data?.ordersByUser || [],
        loading,
        error,
    };
}
