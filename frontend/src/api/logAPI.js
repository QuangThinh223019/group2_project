import { createAuthenticatedAPI } from './axiosConfig';

const logAPI = createAuthenticatedAPI('https://thinh-backend.onrender.com/api/logs');

export const fetchLogs = async () => {
  const res = await logAPI.get('/');
  return res.data;
};

export default { fetchLogs };
