import { useEffect, useState } from "react";
import { Event } from "../models/eventTypes";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TableSortLabel,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import { deleteEvent, fetchEvents } from "../api/api";

const EventList = () => {
  const [filterInput, setFilterInput] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [sortColumn, setSortColumn] = useState<keyof Event | "">(""); 
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); 

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilter(filterInput);
      setPage(0);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [filterInput]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["events", filter, page],
    queryFn: fetchEvents,
  });

  const handleDelete = async (eventId: number) => {
    const password = prompt("Enter your password to confirm deletion:");
    if (!password) return;

    try {
      await deleteEvent(eventId, password);
      alert("Event deleted successfully.");
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert("Error deleting event: " + err.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: keyof Event) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const sortedData = [...(data ?? [])].sort((a:any, b:any) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn as keyof Event];
    const valueB = b[sortColumn as keyof Event];
  
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    } else if (valueA instanceof Date && valueB instanceof Date) {
      return sortDirection === "asc" ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
    }
    return 0;
  });
  
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error has occurred: {(error as Error).message}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {isLoggedIn && (
        <Button
          component={Link}
          to="/events/create"
          variant="contained"
          color="primary"
          style={{ marginBottom: "20px" }}
        >
          Create New Event
        </Button>
      )}

      <TextField
        label="Filter events"
        variant="outlined"
        fullWidth
        value={filterInput}
        onChange={(e) => setFilterInput(e.target.value)}
        InputProps={{
          endAdornment: filterInput && (
            <InputAdornment position="end">
              <IconButton onClick={() => setFilterInput("")} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: "20px" }}
      />

      {isLoggedIn ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "name"}
                    direction={sortDirection}
                    onClick={() => handleSort("name")}
                  >
                    Event Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "startDate"}
                    direction={sortDirection}
                    onClick={() => handleSort("startDate")}
                  >
                    Start Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "endDate"}
                    direction={sortDirection}
                    onClick={() => handleSort("endDate")}
                  >
                    End Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "location"}
                    direction={sortDirection}
                    onClick={() => handleSort("location")}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((event: any) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.status}</TableCell>
                  <TableCell>
                    <Button size="small" component={Link} to={`/events/details/${event.id}`} color="primary">
                      View
                    </Button>
                    <Button size="small" component={Link} to={`/events/update/${event.id}`}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(event.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {paginatedData.map((event:any) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card>
                {event.thumbnail && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.thumbnail}
                    alt={event.name}
                    style={{ objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography color="textSecondary">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography>{event.location}</Typography>
                  <Typography>Status: {event.status}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/events/details/${event.id}`} color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
};

export default EventList;
