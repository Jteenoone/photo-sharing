import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Paper,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import UserPhotos from "../UserPhotos";

const BACKEND_URL = "https://kxt2z7-8081.csb.app/api";

function Profile({ user, token }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchMyPhotos = async () => {
    if (!user?._id) return;

    setLoadingPhotos(true);
    try {
      console.log(user._id);
      const res = await fetch(`${BACKEND_URL}/photo/photosOfUser/${user._id}`);
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      setError("Cannot load your photos");
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchMyPhotos();
  }, [user]);

  const handleChooseFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please choose a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      const res = await fetch(`${BACKEND_URL}/photo/addPhoto`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setMessage("Upload photo successfully!");
      setSelectedFile(null);
      setPreview("");
      fetchMyPhotos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar sx={{ width: 90, height: 90 }}>
          {user?.first_name?.[0] || user?.login_name?.[0] || "U"}
        </Avatar>

        <Box>
          <Typography variant="h6">
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography color="text.secondary">@{user?.login_name}</Typography>
          <Typography color="text.secondary">{user?.occupation}</Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {user?.location}
          </Typography>
          <Typography variant="body1">
            <strong>Occupation:</strong> {user?.occupation}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>About:</strong> {user?.description}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Upload New Photo
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {preview && (
        <Box sx={{ mb: 2 }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", maxWidth: 350, borderRadius: 8 }}
          />
        </Box>
      )}

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" component="label">
          Choose Photo
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleChooseFile}
          />
        </Button>

        <Button variant="contained" onClick={handleUpload}>
          Upload Photo
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        My Photos
      </Typography>

      {loadingPhotos ? (
        <CircularProgress />
      ) : photos.length === 0 ? (
        <Typography color="text.secondary">You have no photos yet.</Typography>
      ) : (
        <Box>
          <UserPhotos token={token} user={user} userId={user._id} />
        </Box>
      )}
    </Paper>
  );
}

export default Profile;
