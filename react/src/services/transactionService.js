// import api from './api';

// const BACKEND_URL = 'http://localhost:8080';

// // Create a new transaction (cashier creates transaction)
// const createTransaction = async (transactionData) => {
//   const response = await api.post('/transactions', transactionData);
//   return response.data.data;
// };

// // Get all transactions (admin/owner only)
// const getAllTransactions = async (limit = 50, skip = 0) => {
//   const response = await api.get(`/transactions?limit=${limit}&skip=${skip}`);
//   return response.data.data || [];
// };

// // Get transaction by ID
// const getTransactionByID = async (id) => {
//   const response = await api.get(`/transactions/${id}`);
//   return response.data.data;
// };

// // Get transactions created by specific cashier
// const getTransactionsByCashier = async (cashierId, limit = 50, skip = 0) => {
//   const response = await api.get(`/transactions/cashier/${cashierId}?limit=${limit}&skip=${skip}`);
//   return response.data.data || [];
// };

// // Cancel a transaction (soft delete - marks as cancelled and restores inventory)
// const cancelTransaction = async (id) => {
//   const response = await api.delete(`/transactions/${id}`);
//   return response.data.message;
// };

// // Format currency for display
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//   }).format(amount);
// };

// // Calculate total price for items
// const calculateTotal = (items, discount = 0, discountPercent = 0) => {
//   const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
//   let discountAmount = discount;

//   if (discountPercent > 0 && discountPercent <= 100) {
//     discountAmount = Math.floor(subtotal * (discountPercent / 100));
//   }

//   if (discountAmount > subtotal) {
//     discountAmount = subtotal;
//   }

//   const total = subtotal - discountAmount;
//   return {
//     subtotal,
//     discountAmount,
//     total,
//   };
// };

// // Calculate change
// const calculateChange = (payAmount, total) => {
//   return payAmount - total;
// };

// export default {
//   createTransaction,
//   getAllTransactions,
//   getTransactionByID,
//   getTransactionsByCashier,
//   cancelTransaction,
//   formatCurrency,
//   calculateTotal,
//   calculateChange,
// };
import api from './api';

const createTransaction = async (data) => {
  const response = await api.post('/transactions', data);
  return response.data.data;
};

const getHistory = async (search = '') => {
  const response = await api.get(`/transactions?search=${search}`);
  return response.data.data;
};

export default {
  createTransaction,
  getHistory,
};