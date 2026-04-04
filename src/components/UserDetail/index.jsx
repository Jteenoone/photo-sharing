import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Divider, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";


const BACKEND_URL = "https://68hr38-3001.csb.app";

function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModel(`${BACKEND_URL}/user/${userId}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (!user) return <Typography sx={{ p: 2 }}>User not found.</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body1"><strong>Location:</strong> {user.location}</Typography>
      <Typography variant="body1"><strong>Occupation:</strong> {user.occupation}</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}><strong>About:</strong> {user.description}</Typography>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate(`/photos/${user._id}`)}
      >
        View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
