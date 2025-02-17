import { useQuery } from "@tanstack/react-query";
import { Event, EventDetailsType } from "../models/eventTypes";
import { fetchEventDetails, deleteEvent } from "../api/api";
import { useHistory } from "react-router-dom";

export const useEventDetailsPresenter = (id: string | undefined) => {
  const history = useHistory();
  const isLoggedIn = !!localStorage.getItem("token");

  const { data: event, isLoading, error } = useQuery<EventDetailsType, Error | null>({
    queryKey: ["eventDetails", id],
    queryFn: () => fetchEventDetails(id!),
    enabled: !!id,
  });

  const handleDelete = async (eventId: number) => {
    const password = prompt("Enter your password to confirm deletion:");
    if (!password) return;

    try {
      await deleteEvent(eventId, password);
      alert("Event deleted successfully.");
      history.push("/events");
    } catch (err) {
      alert("Error deleting event: " + (err instanceof Error ? err.message : "An unexpected error occurred."));
    }
  };

  return { event, isLoading, error, isLoggedIn, handleDelete };
};
