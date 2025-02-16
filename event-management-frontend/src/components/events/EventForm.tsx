import * as yup from 'yup';
import { EventFormData } from '../../models/eventTypes';
import { Button, CardMedia, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.date().required(),
    endDate: yup.date().min(yup.ref('startDate'), "End date can't be before start date").required(),
    location: yup.string().required(),
  });

  interface Props {
    onSubmit: (data: EventFormData) => void;
  }

  const EventForm: React.FC<Props> = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<EventFormData>({
      resolver: yupResolver(schema),
    });
  
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setPreviewUrl(URL.createObjectURL(event.target.files[0]));
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register('name')} label="Event Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />
        <TextField {...register('startDate')} label="Start Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate?.message} />
        <TextField {...register('endDate')} label="End Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.endDate} helperText={errors.endDate?.message} />
        <TextField {...register('location')} label="Location" fullWidth margin="normal" error={!!errors.location} helperText={errors.location?.message} />
  
        {previewUrl && <CardMedia component="img" height="250" image={previewUrl} alt="Thumbnail Preview" sx={{ objectFit: "cover", borderRadius: 2, mt: 2 }} />}
  
        <input {...register('thumbnail')} type="file" accept="image/*" onChange={handleImageChange} />
  
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Create Event
        </Button>
      </form>
    );
  };
  
  export default EventForm;