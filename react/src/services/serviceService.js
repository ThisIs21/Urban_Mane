import api from './api';

const BACKEND_URL = 'http://localhost:8080';

const getAllServices = async (search = '') => {
  const response = await api.get(`/services?search=${search}`);
  return response.data.data;
};

const createService = async (data) => {
  const response = await api.post('/services', data);
  return response.data.data;
};

const updateService = async (id, data) => {
  const response = await api.put(`/services/${id}`, data);
  return response.data.data;
};

const deleteService = async (id) => {
  await api.delete(`/services/${id}`);
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.url;
};

const getOwnerDashboard = async () => {
  const response = await api.get('/dashboard/owner');
  return response.data;
};


// ========== PERBAIKAN GAMBAR ==========
const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;

  let cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (cleanPath.startsWith('/images') || cleanPath.startsWith('/uploads')) {
    return encodeURI(`${BACKEND_URL}${cleanPath}`);
  }

  return encodeURI(`${BACKEND_URL}/images/products${cleanPath}`);
};

export default {
  getAllServices,
  createService,
  updateService,
  deleteService,
  uploadFile,
  getImageUrl,
  getOwnerDashboard,
};