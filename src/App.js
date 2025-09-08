// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";
import RedirectPage from "./components/RedirectPage";
import LogsPage from "./components/LogsPage";
import { getAllUrls, cleanupExpired } from "./services/urlService";
import { AppBar, Toolbar, Typography, Container, Button, Box } from "@mui/material";

function Home() {
  const [urls, setUrls] = useState([]);

  const load = () => {
    cleanupExpired();
    setUrls(getAllUrls());
  };

  useEffect(() => {
    load();
    
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <UrlForm onCreated={load} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Saved Short URLs</Typography>
        <UrlList urls={urls} />
      </Box>
    </Container>
  );
}

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            URL Shortener (Affordmed)
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/logs">Logs</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/:code" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}
