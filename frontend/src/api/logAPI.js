import { createAuthenticatedAPI } from './axiosConfig';

const logAPI = createAuthenticatedAPI(process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api/logs` : 'http://localhost:4000/api/logs');

export const fetchLogs = async () => {
  const res = await logAPI.get('/');
  return res.data;
};

export default { fetchLogs };
