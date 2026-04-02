import api from './api';

// ========== BACKEND URL CONSTANT ==========
// All image requests go to this backend server
const BACKEND_URL = 'http://localhost:8080';

// ========== CRUD FUNCTIONS ==========
const getAllBundles = async (search = '') => {
  const response = await api.get('/bundles', {
    params: { search },
  });
  const data = response.data.data;
  console.log('getAllBundles response:', data);  // DEBUG
  if (data && data.length > 0) {
    console.log('First bundle image:', data[0].image);  // DEBUG
  }
  return data;
};

const getBundleByID = async (id) => {
  const response = await api.get(`/bundles/${id}`);
  return response.data.data;
};

const createBundle = async (data) => {
  const response = await api.post('/bundles', data);
  return response.data.data;
};

const updateBundle = async (id, data) => {
  const response = await api.put(`/bundles/${id}`, data);
  return response.data.data;
};

const deleteBundle = async (id) => {
  const response = await api.delete(`/bundles/${id}`);
  return response.data;
};

// ========== IMAGE URL HELPER FUNCTION ==========
// IMPORTANT: Converts relative image paths to full backend URLs
// Database stores: "/images/products/photo.jpg"
// Convert to: "http://localhost:8080/images/products/photo.jpg"
// RULE: If path starts with /, just prepend BACKEND_URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (cleanPath.startsWith('/images') || cleanPath.startsWith('/uploads')) {
    return `${BACKEND_URL}${cleanPath}`;
  }

  return `${BACKEND_URL}/images/products${cleanPath}`;
};

export default {
  getAllBundles,
  getBundleByID,
  createBundle,
  updateBundle,
  deleteBundle,
  getImageUrl,
};
