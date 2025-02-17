import React from "react";
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, CardMedia } from "@mui/material";
import { useEventUpdatePresenter } from "../presenters/EventUpdatePresenter";

const EventUpdateView: React.FC = () => {
  const { register, handleSubmit, errors, isLoading, onSubmit, previewUrl, history } = useEventUpdatePresenter();

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Update Event
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...register("name")} label="Event Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />
        <TextField {...register("startDate")} label="Start Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate?.message} />
        <TextField {...register("endDate")} label="End Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={!!errors.endDate} helperText={errors.endDate?.message} />
        <TextField {...register("location")} label="Location" fullWidth margin="normal" error={!!errors.location} helperText={errors.location?.message} />
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Status</InputLabel>
          <Select labelId="status-label" {...register("status")} error={!!errors.status}>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        {previewUrl && <CardMedia component="img" height="250" image={previewUrl} alt="Thumbnail Preview" sx={{ objectFit: "cover", borderRadius: 2, mt: 2 }} />}

        <input
          {...register('thumbnailUrl')}
          type="file"
          accept="image/*"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Update Event
        </Button>
        <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }} onClick={() => history.push("/events")}>
          Back to Events
        </Button>
      </form>
    </Container>
  );
};

export default EventUpdateView;
