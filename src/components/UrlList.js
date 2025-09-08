
import React from "react";
import { List, ListItem, ListItemText, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { deleteShortUrl } from "../services/urlService";

export default function UrlList({ urls, onRefresh }) {
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Unable to copy");
    }
  };

  const handleDelete = (code) => {
    if (!window.confirm("Delete this short URL?")) return;
    deleteShortUrl(code);
    onRefresh && onRefresh();
  };

  if (!urls.length) {
    return <Typography sx={{ mt: 2 }}>No short URLs yet.</Typography>;
  }

  return (
    <List>
      {urls.map((u) => {
        const shortUrl = `${window.location.origin}/${u.shortCode}`;
        return (
          <ListItem key={u.shortCode}
            secondaryAction={
              <>
                <Tooltip title="Open original">
                  <IconButton
                    edge="end"
                    onClick={() => window.open(u.longUrl, "_blank", "noopener")}
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Copy short link">
                  <IconButton edge="end" onClick={() => handleCopy(shortUrl)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton edge="end" onClick={() => handleDelete(u.shortCode)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <ListItemText
              primary={
                <span>
                  <a href={shortUrl}>{shortUrl}</a> &nbsp; → &nbsp;
                  <a href={u.longUrl} target="_blank" rel="noreferrer">{u.longUrl}</a>
                </span>
              }
              secondary={`Expires: ${new Date(u.expiry).toLocaleString()}`}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
