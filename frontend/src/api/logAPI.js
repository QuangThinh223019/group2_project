import { createAuthenticatedAPI } from './axiosConfig';
import { API_BASE } from "../config/apiBase";

const logAPI = createAuthenticatedAPI(`${API_BASE}/api/logs`);

export const fetchLogs = async () => {
  const res = await logAPI.get('/');
  return res.data;
};

export default { fetchLogs };
