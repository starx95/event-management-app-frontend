import { useParams } from "react-router-dom";
import EventDetailsView from "./EventDetailsView";
import { useEventDetailsPresenter } from "../presenters/EventDetailsPresenter";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading, error, isLoggedIn, handleDelete } = useEventDetailsPresenter(id);

  return <EventDetailsView event={event} isLoading={isLoading} error={error} isLoggedIn={isLoggedIn} handleDelete={handleDelete} />;
};

export default EventDetails;
