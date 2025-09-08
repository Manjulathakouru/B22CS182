
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLongUrl } from "../services/urlService";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

export default function RedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); 
  useEffect(() => {
    const longUrl = getLongUrl(code);
    if (longUrl) {
      
      window.location.replace(longUrl);
    } else {
      setStatus("notfound");
    }
  }, [code, navigate]);

  if (status === "checking") {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h6">Link not found or expired.</Typography>
      <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Container>
  );
}
