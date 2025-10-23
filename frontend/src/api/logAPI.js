import { createAuthenticatedAPI } from './axiosConfig';

const logAPI = createAuthenticatedAPI('http://localhost:4000/api/logs');

export const fetchLogs = async () => {
  const res = await logAPI.get('/');
  return res.data;
};

export default { fetchLogs };
