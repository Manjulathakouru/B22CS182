import React, { useState } from "react";
import { createShortUrl } from "../services/urlService";
import { TextField, Button, Box, Alert, Stack } from "@mui/material";

export default function UrlForm({ onCreated }) {
  const [urls, setUrls] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [validity, setValidity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const urlArray = urls.split("\n").map(u => u.trim()).filter(u => u).slice(0, 5);
    if (urlArray.length === 0) {
      setError("Please enter at least one valid URL.");
      return;
    }
    let messages = [];
    for (let i = 0; i < urlArray.length; i++) {
      try {
        const code = createShortUrl(urlArray[i], customCode.trim(), validity || 30);
        const shortUrl = `${window.location.origin}/${code}`;
        messages.push(`Short link created: ${shortUrl}`);
      } catch (err) {
        messages.push(`Error for URL ${urlArray[i]}: ${err.message}`);
      }
    }
    setSuccess(messages.join("\n"));
    setUrls("");
    setCustomCode("");
    setValidity("");
    onCreated && onCreated();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success" sx={{ whiteSpace: "pre-line" }}>{success}</Alert>}

        <TextField
          label="Enter up to 5 URLs (one per line)"
          value={urls}
          required
          onChange={(e) => setUrls(e.target.value)}
          fullWidth
          multiline
          rows={5}
        />

        <TextField
          label="Custom shortcode (optional - 4-12 chars, letters/numbers/_/-)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          fullWidth
        />

        <TextField
          label="Validity (minutes) — default 30"
          type="number"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          fullWidth
          inputProps={{ min: 1 }}
        />

        <Button type="submit" variant="contained">
          Shorten
        </Button>
      </Stack>
    </Box>
  );
}