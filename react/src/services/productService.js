import api from './api';

const BACKEND_URL = 'http://localhost:8080';

const getAllProducts = async (search = '') => {
  const response = await api.get(`/products?search=${search}`);
  return response.data.data;
};

const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data.data;
};

const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data.data;
};

const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

const updateStock = async (id, quantity, type = 'set') => {
  const response = await api.put(`/products/${id}/stock`, { quantity, type, date: new Date().toISOString() });
  return response.data.data;
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.url;
};

// ========== IMAGE URL HELPER FUNCTION ==========
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) return imagePath;

  
  let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  
  if (cleanPath.startsWith('/images') || cleanPath.startsWith('/uploads')) {
    return encodeURI(`${BACKEND_URL}${cleanPath}`);
  }

  return encodeURI(`${BACKEND_URL}/images/products${cleanPath}`);
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadFile,
  getImageUrl,
};