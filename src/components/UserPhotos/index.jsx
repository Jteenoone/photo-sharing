import React from "react";
import {
  Typography, Box, Card, CardMedia, CardContent,
  Divider, Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

function UserPhotos({ advancedFeatures }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const photos = models.photoOfUserModel(userId);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (!photos || photos.length === 0) {
    return <Typography sx={{ p: 2 }}>No photos found for this user.</Typography>;
  }

  if (advancedFeatures) {
    const currentIndex = photoIndex !== undefined ? parseInt(photoIndex) : 0;
    const photo = photos[currentIndex];

    return (
      <Box sx={{ p: 2 }}>
        {/* Stepper controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="outlined"
            disabled={currentIndex === 0}
            onClick={() => navigate(`/photos/${userId}/${currentIndex - 1}`)}
          >
            ← Prev
          </Button>
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} / {photos.length}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentIndex === photos.length - 1}
            onClick={() => navigate(`/photos/${userId}/${currentIndex + 1}`)}
          >
            Next →
          </Button>
        </Box>

        {/* Single photo */}
        <Card>
          <CardMedia
            component="img"
            image={require(`../../images/${photo.file_name}`)}
            alt="user photo"
            sx={{ maxHeight: 400, objectFit: "contain", bgcolor: "#f5f5f5" }}
          />
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              {formatDate(photo.date_time)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 1, pl: 1, borderLeft: "3px solid #ddd" }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                  <Typography variant="body2">
                    <span
                      style={{ fontWeight: "bold", cursor: "pointer", color: "#1976d2" }}
                      onClick={() => navigate(`/users/${comment.user._id}`)}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                    : {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No comments.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {photos.map((photo) => (
        <Card key={photo._id} sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            image={require(`../../images/${photo.file_name}`)}
            alt="user photo"
            sx={{ maxHeight: 400, objectFit: "contain", bgcolor: "#f5f5f5" }}
          />
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              {formatDate(photo.date_time)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 1, pl: 1, borderLeft: "3px solid #ddd" }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                  <Typography variant="body2">
                    <span
                      style={{ fontWeight: "bold", cursor: "pointer", color: "#1976d2" }}
                      onClick={() => navigate(`/users/${comment.user._id}`)}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                    : {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No comments.</Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
