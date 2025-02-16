import axios from 'axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await axios.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const storeToken = (token: string) => {
  localStorage.setItem('token', token);
};
