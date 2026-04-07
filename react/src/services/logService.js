import api from './api';

const getLogs = async () => {
  const response = await api.get('/logs');
  return response.data.data;
};

export default { getLogs };