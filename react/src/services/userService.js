import api from './api';

// ========== BACKEND URL CONSTANT ==========
// All image requests go to this backend server
const BACKEND_URL = 'http://localhost:8080';

// ========== FETCH & CRUD FUNCTIONS ==========
const getAllUsers = async (search = '') => {
  const response = await api.get(`/users?search=${search}`);
  const data = response.data.data;
  console.log('getAllUsers response:', data);  // DEBUG
  if (data && data.length > 0) {
    console.log('First user photoUrl:', data[0].photoUrl);  // DEBUG
  }
  return data;
};

const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data.data;
};

const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data.data;
};

const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// ========== IMAGE URL HELPER FUNCTION ==========

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (cleanPath.startsWith('/images') || cleanPath.startsWith('/uploads')) {
      return `${BACKEND_URL}${cleanPath}`;
  }
  
  return `${BACKEND_URL}/images/products${cleanPath}`;
};

// ========== FILE UPLOAD FUNCTION ==========
// Upload photo file to backend /upload endpoint
const uploadPhoto = async (formData) => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getImageUrl,
  uploadPhoto,
};