import api from './api';

const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data.data;
};

const getQueue = async () => {
  const response = await api.get('/orders/queue');
  return response.data.data;
};

const getWaitingPayment = async () => {
  const response = await api.get('/orders/payment');
  return response.data.data;
};

const startOrder = async (id) => {
  const response = await api.put(`/orders/${id}/start`);
  return response.data;
};

const finishOrder = async (id) => {
  const response = await api.put(`/orders/${id}/finish`);
  return response.data;
};

const processPayment = async (id, data) => {
  const response = await api.put(`/orders/${id}/pay`, data);
  return response.data.data;
};

const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};

const getHistory = async (start = '', end = '') => {
  const response = await api.get(`/orders/history?start=${start}&end=${end}`);
  return response.data.data;
};


export default {
  createOrder,
  getQueue,
  getWaitingPayment,
  startOrder,
  finishOrder,
  processPayment,
  cancelOrder,
   getHistory,
};