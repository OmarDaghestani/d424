import axios from 'axios';

import { API_URL } from '../config.js';

// Create a new order
export const createOrder = async (orderData) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) throw new Error('No token found, user not authenticated.');
  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  
    const { data } = await axios.post(`${API_URL}/api/orders`, orderData, config);
    return data;
  };

// Get user's orders
export const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

// Get all orders (Admin only)
export const getAllOrders = async () => {
    const response = await axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};
