import axios from "axios";
import type { Event, EventFormData } from "../models/eventTypes";

const API_URL = "http://localhost:3000/events";

export const fetchEventDetails = async (id: string): Promise<Event> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

export const updateEvent = async (id: string, data: EventFormData) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "thumbnailUrl" && data.thumbnailUrl?.[0]) {
      formData.append(key, data.thumbnailUrl[0]);
    } else if (key === "startDate" || key === "endDate") {
      formData.append(key, new Date(data[key as keyof EventFormData] as string).toISOString());
    } else {
      formData.append(key, data[key as keyof EventFormData] as string);
    }
  });

  return axios.patch(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
