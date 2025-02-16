import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, CardMedia } from '@mui/material';
import { EventFormData } from '../models/eventTypes';

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
  status: yup.string().oneOf(["Ongoing", "Completed"]).required()
});

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  errors?: any;
  event?: EventFormData;
  previewUrl?: string | null;
  handleImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, errors, event, previewUrl, handleImageChange }) => {
  const { register, handleSubmit, setValue } = useForm<EventFormData>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (event) {
      setValue('name', event.name);
      setValue("startDate", new Date(event.startDate).toISOString().split("T")[0]); 
      setValue("endDate", new Date(event.endDate).toISOString().split("T")[0]); 
      setValue('location', event.location);
      setValue('status', event.status);
    }
  }, [event, setValue]);

  return (
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
        {...register('thumbnailUrl')}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
        Update Event
      </Button>
    </form>
  );
};

export default EventForm;
