import api from './api';

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

export default {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
