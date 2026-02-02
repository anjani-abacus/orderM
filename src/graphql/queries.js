import { gql } from '@apollo/client';

// Orders queries
export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      orderNo
      status
      amount
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_ORDER_STATS = gql`
  query GetOrderStats {
    orderStats {
      totalOrders
      totalRevenue
    }
  }
`;

// Advanced Analytics queries
export const GET_ORDERS_BY_DATE = gql`
  query GetOrdersByDate($days: Int) {
    ordersByDate(days: $days) {
      date
      count
      revenue
    }
  }
`;

export const GET_ORDERS_BY_STATUS = gql`
  query GetOrdersByStatus {
    ordersByStatus {
      status
      count
      revenue
    }
  }
`;

export const GET_ORDERS_BY_USER = gql`
  query GetOrdersByUser($limit: Int) {
    ordersByUser(limit: $limit) {
      userId
      userName
      count
      revenue
    }
  }
`;

// Users queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      isActive
    }
  }
`;
