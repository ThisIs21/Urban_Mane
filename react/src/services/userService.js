import api from './api';

const getAllUsers = async (search = '') => {
  const response = await api.get(`/users?search=${search}`);
  return response.data.data; // Ambil array datanya
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

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};