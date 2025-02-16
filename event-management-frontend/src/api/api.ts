import axios from "axios";
import { EventDetailsType, LoginData, LoginResponse } from "../models/eventTypes";

const api = axios.create({
  baseURL: "http://localhost:3000", 
  withCredentials: true, 
});

export const createEvent = async (data: FormData) => {
    return api.post('/events', data, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
  };

export const login = async (data: LoginData) => {
    return api.post<LoginResponse>("/auth/login", data);
  };

export const fetchEvents = async ({
    queryKey,
  }: {
    queryKey: [string, string, number];
  }): Promise<Event[]> => {
    const [, filter, page] = queryKey;
  
    const { data } = await api.get<Event[]>("/events", {
      params: { filter  },
      withCredentials: true,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  
    return data;
  };

export const fetchEventDetails = async (eventId: string): Promise<EventDetailsType> => {
    const response = await api.get<EventDetailsType>(`/events/${eventId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  };

export const deleteEvent = async (eventId: number, password: string) => {
  return api.delete(`/events/${eventId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { password }, 
  });
};

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("token", data.accessToken); 

 
        error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Refresh token failed, logging out...");
        localStorage.removeItem("token");
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
