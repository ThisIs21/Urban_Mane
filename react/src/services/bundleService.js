import api from './api';

const getAllBundles = async (search = '') => {
  const response = await api.get('/bundles', {
    params: { search },
  });
  return response.data.data;
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

export default {
  getAllBundles,
  getBundleByID,
  createBundle,
  updateBundle,
  deleteBundle,
};
