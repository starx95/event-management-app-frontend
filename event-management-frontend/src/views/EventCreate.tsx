import React from "react";
import { Container, TextField, Button, Typography, CardMedia } from "@mui/material";
import { useEventCreatePresenter } from "../presenters/EventCreatePresenter";

const EventCreate = () => {
  const { register, handleSubmit, errors, onSubmit, handleImageChange, previewUrl } = useEventCreatePresenter();

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Create Event
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("name")}
          label="Event Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          {...register("startDate")}
          label="Start Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.startDate}
          helperText={errors.startDate?.message}
        />
        <TextField
          {...register("endDate")}
          label="End Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.endDate}
          helperText={errors.endDate?.message}
        />
        <TextField
          {...register("location")}
          label="Location"
          fullWidth
          margin="normal"
          error={!!errors.location}
          helperText={errors.location?.message}
        />

        {previewUrl && (
          <CardMedia
            component="img"
            height="250"
            image={previewUrl}
            alt="Thumbnail Preview"
            sx={{ objectFit: "cover", borderRadius: 2, mt: 2 }}
          />
        )}

        <input {...register("thumbnailUrl")} type="file" accept="image/*" onChange={handleImageChange} />

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
          Create Event
        </Button>
      </form>
    </Container>
  );
};

export default EventCreate;
