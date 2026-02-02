import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      name
      email
      role
      isActive
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// Order mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNo
      status
      amount
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: UpdateOrderInput!) {
    updateOrderStatus(input: $input) {
      id
      orderNo
      status
      amount
    }
  }
`;

// User mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      isActive
    }
  }
`;
