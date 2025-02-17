import { Link } from "react-router-dom";
import { Container, Typography, Card, CardContent, Button, CardMedia } from "@mui/material";
import { Event, EventDetailsType } from "../models/eventTypes";

interface EventDetailsViewProps {
  event?: EventDetailsType;
  isLoading: boolean;
  error: Error | null;
  isLoggedIn: boolean;
  handleDelete: (eventId: number) => void;
}

const EventDetailsView: React.FC<EventDetailsViewProps> = ({ event, isLoading, error, isLoggedIn, handleDelete }) => {
  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error has occurred: {error.message}</Typography>;

  return (
    <Container>
      <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        {event?.thumbnailUrl && (
          <CardMedia
            component="img"
            height="250"
            image={ `http://localhost:3000/${event.thumbnailUrl}`}
            alt={event.name}
            sx={{ objectFit: "cover", borderRadius: 2 }}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>{event?.name}</Typography>
          <Typography variant="body1"><strong>Start Date:</strong> {event?.startDate ? new Date(event.startDate).toLocaleDateString() : "N/A"}</Typography>
          <Typography variant="body1"><strong>End Date:</strong> {event?.endDate ? new Date(event.endDate).toLocaleDateString() : "N/A"}</Typography>
          <Typography variant="body1"><strong>Location:</strong> {event?.location}</Typography>
          <Typography variant="body1"><strong>Status:</strong> {event?.status}</Typography>
        </CardContent>
      </Card>

      <Button component={Link} to="/events" variant="contained" sx={{ mt: 2, mr: 2 }}>
        Back to Events
      </Button>

      {isLoggedIn && event?.id && (
        <>
          <Button component={Link} to={`/events/update/${event.id}`} variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(event.id)} variant="contained" color="error" sx={{ mt: 2 }}>
            Delete
          </Button>
        </>
      )}
    </Container>
  );
};

export default EventDetailsView;
