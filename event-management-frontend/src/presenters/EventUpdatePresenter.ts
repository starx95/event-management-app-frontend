import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory, useParams } from "react-router-dom";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { fetchEventDetails, updateEvent } from "../services/eventService";
import type { EventFormData, Event } from "../models/eventTypes";

const schema = yup.object().shape({
  name: yup.string().required(),
  startDate: yup.string().required("Start date is required").test("valid-date", "Invalid date", value => !isNaN(Date.parse(value || ""))),
  endDate: yup
    .string()
    .required("End date is required")
    .test("valid-date", "Invalid date", value => !isNaN(Date.parse(value || "")))
    .test("is-after-start", "End date can't be before start date", function (value) {
      const startDate = Date.parse(this.parent.startDate);
      const endDate = Date.parse(value || "");
      return !isNaN(startDate) && !isNaN(endDate) && endDate >= startDate;
    }),
  location: yup.string().required(),
  status: yup.string().oneOf(["Ongoing", "Completed"]).required(),
});

export const useEventUpdatePresenter = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EventFormData>({
    resolver: yupResolver(schema),
  });

  const { data: event, isLoading } = useQuery<Event, Error>({
    queryKey: ["event", id],
    queryFn: () => fetchEventDetails(id),
  });

  useEffect(() => {
    if (event) {
      setValue("name", event.name);
      setValue("startDate", new Date(event.startDate).toISOString().split("T")[0]);
      setValue("endDate", new Date(event.endDate).toISOString().split("T")[0]);
      setValue("location", event.location);
      setValue("status", event.status);
      if (event.thumbnailUrl) {
        const imagePath = event.thumbnailUrl.startsWith("http")
          ? event.thumbnailUrl
          : `http://localhost:3000/${event.thumbnailUrl.replace(/\\/g, "/")}`;
        setPreviewUrl(imagePath);
      }
    }
  }, [event, setValue]);

  const updateEventMutation = useMutation({
    mutationFn: (data: EventFormData) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      history.push("/events");
    },
  });

  const onSubmit = (data: EventFormData) => {
    updateEventMutation.mutate(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      setValue("thumbnailUrl", event.target.files);
    }
  };

  return { register, handleSubmit, errors, isLoading, onSubmit, handleImageChange, previewUrl, history };
};
