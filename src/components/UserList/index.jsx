import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const BACKEND_URL = "https://5yry4v-8081.csb.app/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [photoCounts, setPhotoCounts] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchModel(`${BACKEND_URL}/user/list`);
        setUsers(usersData);

        // Lấy số ảnh và số comments của từng user đồng thời
        const photoCountMap = {};
        const commentCountMap = {};

        await Promise.all(
          usersData.map(async (user) => {
            const [photoRes, commentRes] = await Promise.all([
              fetchModel(`${BACKEND_URL}/photo/countByUser/${user._id}`),
              fetchModel(`${BACKEND_URL}/photo/commentsByUser/${user._id}`),
            ]);
            photoCountMap[user._id] = photoRes.count;
            commentCountMap[user._id] = commentRes.length;
          })
        );

        setPhotoCounts(photoCountMap);
        setCommentCounts(commentCountMap);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <div>
      <Typography variant="h6" sx={{ p: 2 }}>
        Users
      </Typography>
      <Divider />
      <List component="nav">
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(`/users/${user._id}`)}>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                />
              </ListItemButton>
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* Bubble xanh - số ảnh */}
                <Chip
                  label={photoCounts[user._id] ?? 0}
                  size="small"
                  sx={{
                    bgcolor: "green",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
                {/* Bubble đỏ - số comments, click vào xem comments */}
                <Chip
                  label={commentCounts[user._id] ?? 0}
                  size="small"
                  sx={{ bgcolor: "red", color: "white", fontWeight: "bold" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/comments/${user._id}`);
                  }}
                />
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
