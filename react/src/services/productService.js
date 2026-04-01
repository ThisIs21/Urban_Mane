import api from './api';

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

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.url;
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadFile,
};