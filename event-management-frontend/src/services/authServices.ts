import axios from 'axios';
import { RegisterData } from '../models/registerTypes';

const API_URL = 'http://localhost:3000/auth';

export const registerUser = async (data: RegisterData) => {
  const response = await axios.post(`${API_URL}/register`, data, { withCredentials: true });
  return response.data;
};
