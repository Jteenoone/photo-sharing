import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import fetchModel from "../../lib/fetchModelData";

const BACKEND_URL = "https://5yry4v-8081.csb.app/api";

function UserComments() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsData, userData] = await Promise.all([
          fetchModel(`${BACKEND_URL}/photo/commentsByUser/${userId}`),
          fetchModel(`${BACKEND_URL}/user/${userId}`),
        ]);
        setComments(commentsData);
        setUser(userData);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Comments by {user ? `${user.first_name} ${user.last_name}` : ""}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {comments.length === 0 ? (
        <Typography>No comments found.</Typography>
      ) : (
        comments.map((item) => (
          <Card
            key={item._id}
            sx={{ mb: 2, cursor: "pointer", "&:hover": { boxShadow: 4 } }}
            onClick={() => navigate(`/photos/${item.photo.user_id}`)}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* Thumbnail ảnh */}
              <CardMedia
                component="img"
                image={require(`../../images/${item.photo.file_name}`)}
                alt="photo thumbnail"
                sx={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(item.date_time)}
                </Typography>
                <Typography variant="body1">{item.comment}</Typography>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserComments;
