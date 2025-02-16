import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, CardMedia } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import type { Event } from "../models/eventTypes";

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

interface EventFormData {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  status: "Ongoing" | "Completed";
  thumbnail?: FileList;
}

const EventUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // State for image preview

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EventFormData>({
    resolver: yupResolver(schema),
  });

  const { data: event, isLoading, error } = useQuery<Event, Error>({
    queryKey: ['event', id],
    queryFn: () => axios.get(`http://localhost:3000/events/${id}`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((res) => res.data),
  });

  React.useEffect(() => {
    if (event) {
      setValue('name', event.name);
      setValue("startDate", new Date(event.startDate).toISOString().split("T")[0]); 
      setValue("endDate", new Date(event.endDate).toISOString().split("T")[0]); 
      setValue('location', event.location);
      setValue('status', event.status);
      if (event.thumbnailUrl) {
        const imagePath = event.thumbnailUrl.startsWith("http")
          ? event.thumbnailUrl
          : `http://localhost:3000/${event.thumbnailUrl.replace(/\\/g, "/")}`;
  
        setPreviewUrl(imagePath);
      }
    }
  }, [event, setValue]);

  const updateEventMutation = useMutation<AxiosResponse<any>, Error, EventFormData>({
    mutationFn: (data: EventFormData) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'thumbnail' && data.thumbnail?.[0]) {
          formData.append(key, data.thumbnail[0]);
        } else if (key === "startDate" || key === "endDate") {
            formData.append(key, (data[key as keyof EventFormData] as string));
        } else {
          formData.append(key, data[key as keyof EventFormData] as string);
        }
      });
      return axios.patch(`http://localhost:3000/events/${id}`, formData, {
        withCredentials: true,
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      history.push('/events');
    },
  });

  const onSubmit = (data: EventFormData) => {
    updateEventMutation.mutate(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreviewUrl(URL.createObjectURL(file)); 
      setValue('thumbnail', event.target.files);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Update Event
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('name')}
          label="Event Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          {...register('startDate')}
          label="Start Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.startDate}
          helperText={errors.startDate?.message}
        />
        <TextField
          {...register('endDate')}
          label="End Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.endDate}
          helperText={errors.endDate?.message}
        />
        <TextField
          {...register('location')}
          label="Location"
          fullWidth
          margin="normal"
          error={!!errors.location}
          helperText={errors.location?.message}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            {...register('status')}
            defaultValue={event?.status || ""}
            error={!!errors.status}
          >
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        
        {/* Thumbnail Preview */}
        {previewUrl && (
          <CardMedia
            component="img"
            height="250"
            image={previewUrl}
            alt="Thumbnail Preview"
            sx={{ objectFit: "cover", borderRadius: 2, mt: 2 }}
          />
        )}

        <input
          {...register('thumbnail')}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          Update Event
        </Button>
        <Button 
  variant="outlined" 
  color="secondary" 
  fullWidth 
  style={{ marginTop: '10px' }} 
  onClick={() => history.push('/events')}
>
  Back to Events
</Button>
      </form>
    </Container>
  );
};

export default EventUpdate;
