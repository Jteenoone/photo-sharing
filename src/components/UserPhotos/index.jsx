import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const BACKEND_URL = "https://5yry4v-8081.csb.app/api";

function UserPhotos({ advancedFeatures, token, user }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await fetchModel(
          `${BACKEND_URL}/photo/photosOfUser/${userId}`
        );
        setPhotos(data);
      } catch (err) {
        console.error("Failed to fetch photos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [userId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddComment = async (photoId) => {
    if (!commentText[photoId]?.trim()) return;
    const res = await fetch(`${BACKEND_URL}/comment/addComment/${photoId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ comment: commentText[photoId] }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setPhotos(
        photos.map((p) => {
          if (p._id === photoId) {
            return { ...p, comments: [...(p.comments || []), newComment] };
          }
          return p;
        })
      );
      setCommentText({ ...commentText, [photoId]: "" });
    }
  };

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  if (!photos || photos.length === 0) {
    return (
      <Typography sx={{ p: 2 }}>No photos found for this user.</Typography>
    );
  }

  // ---- ADVANCED MODE: hiện 1 ảnh + stepper ----
  if (advancedFeatures) {
    const currentIndex = photoIndex !== undefined ? parseInt(photoIndex) : 0;
    const photo = photos[currentIndex];

    return (
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
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
            <Typography variant="subtitle2" gutterBottom>
              Comments:
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{ mb: 1, pl: 1, borderLeft: "3px solid #ddd" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                  <Typography variant="body2">
                    <span
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#1976d2",
                      }}
                      onClick={() => navigate(`/users/${comment.user._id}`)}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                    : {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments.
              </Typography>
            )}
            {user && (
              <Box sx={{ display: "flex", mt: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Thêm comment..."
                  value={commentText[photo._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [photo._id]: e.target.value,
                    })
                  }
                />
                <Button onClick={() => handleAddComment(photo._id)}>Gửi</Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ---- NORMAL MODE: hiện tất cả ảnh ----
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
            <Typography variant="subtitle2" gutterBottom>
              Comments:
            </Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{ mb: 1, pl: 1, borderLeft: "3px solid #ddd" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date_time)}
                  </Typography>
                  <Typography variant="body2">
                    <span
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#1976d2",
                      }}
                      onClick={() => navigate(`/users/${comment.user._id}`)}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                    : {comment.comment}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments.
              </Typography>
            )}
            {user && (
              <Box sx={{ display: "flex", mt: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Thêm comment..."
                  value={commentText[photo._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [photo._id]: e.target.value,
                    })
                  }
                />
                <Button onClick={() => handleAddComment(photo._id)}>Gửi</Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default UserPhotos;
