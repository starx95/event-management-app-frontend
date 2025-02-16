import axios from "axios";
import type { Event } from "../models/eventTypes";

const API_URL = "http://localhost:3000/events";

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const updateEvent = async (id: string, data: FormData) => {
  return axios.patch(`${API_URL}/${id}`, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
