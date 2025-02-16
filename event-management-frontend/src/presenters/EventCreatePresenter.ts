import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { EventFormData } from "../models/EventFormData";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Event name is required"),
  startDate: yup
    .date()
    .typeError("Start date must be a valid date") // Handles invalid dates
    .required("Start date is required"),
    endDate: yup
    .date()
    .typeError("End date must be a valid date")
    .required("End date is required")
    .min(yup.ref("startDate"), "End date can't be before start date"),
  location: yup.string().required("Location is required"),
});

export const useEventCreatePresenter = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EventFormData>({
    resolver: yupResolver(schema),
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "thumbnail" && data.thumbnail?.[0]) {
          formData.append(key, data.thumbnail[0]);
        } else if (key === "startDate" || key === "endDate") {
            const isoDate = new Date(data[key as keyof EventFormData] as string).toISOString();
            formData.append(key, isoDate);
          } else {
          formData.append(key, data[key as keyof EventFormData] as string);
        }
      });

      return axios.post("http://localhost:3000/events", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      history.push('/events');
    },
  });

  const onSubmit = (data: EventFormData) => createEventMutation.mutate(data);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPreviewUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleImageChange,
    previewUrl,
  };
};
