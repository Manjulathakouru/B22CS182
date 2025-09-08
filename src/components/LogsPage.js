
import React from "react";
import { readLogs } from "../middleware/logger";
import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function LogsPage() {
  const logs = readLogs();

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5">Activity Logs</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        (Latest first; stored in localStorage)
      </Typography>
      <List>
        {logs.length === 0 && <Typography>No logs yet.</Typography>}
        {logs.map((l, i) => (
          <ListItem key={i} alignItems="flex-start">
            <ListItemText
              primary={`${l.time} — ${l.action}`}
              secondary={JSON.stringify(l.data)}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
