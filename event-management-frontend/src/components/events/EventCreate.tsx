import React from 'react';
import { Container, Typography } from '@mui/material';
import EventForm from './EventForm';
import { useEventMutation } from '../../hooks/useEventMutation';
import { useHistory } from 'react-router-dom';

const EventCreate = () => {
  const history = useHistory();
  const createEventMutation = useEventMutation();

  const handleSubmit = (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'thumbnail' && data.thumbnail?.[0]) {
        formData.append(key, data.thumbnail[0]);
      } else if (key === "startDate" || key === "endDate") {
        formData.append(key, (data[key] as Date).toISOString());
      } else {
        formData.append(key, data[key]);
      }
    });

    createEventMutation.mutate(formData, {
      onSuccess: () => history.push('/events'),
    });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create Event
      </Typography>
      <EventForm onSubmit={handleSubmit} />
    </Container>
  );
};

export default EventCreate;