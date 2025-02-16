import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect  } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from "./components/Layout";
import Login from './views/LoginView';
import Register from './views/Register';
import EventList from './views/EventList';
import EventCreate from './components/events/EventCreate';
import EventUpdate from './views/EventUpdate';
import EventDetails from './views/EventDetails';
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const theme = createTheme();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
        <Layout>
          <Switch>
          <Redirect exact from="/" to="/login" />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/events" exact component={EventList} />
            <ProtectedRoute exact path="/events/create" component={EventCreate} />
            <Route path="/events/details/:id" component={EventDetails} />
            <ProtectedRoute path="/events/update/:id" component={EventUpdate} />
          </Switch>
        </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;