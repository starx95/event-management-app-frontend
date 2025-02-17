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
  startDate: yup.string().required(),
  endDate: yup.string().min(yup.ref('startDate'), "End date can't be before start date").required(),
  location: yup.string().required(),
  status: yup.string().oneOf(["Ongoing", "Completed"]).required(),
});

export const useEventUpdatePresenter = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

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
      setValue('startDate', event.startDate.split('T')[0]);
      setValue('endDate', event.endDate.split('T')[0]);
      setValue("location", event.location);
      setValue("status", event.status);
      if (event.thumbnailUrl) {
        const imagePath = event.thumbnailUrl
          ?  `http://localhost:3000/${event.thumbnailUrl}`
          :  event.thumbnailUrl;
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

  return { register, handleSubmit, errors, isLoading, onSubmit, previewUrl, history };
};
