import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const BACKEND_URL = "https://5yry4v-8081.csb.app/api";

function TopBar({ advancedFeatures, setAdvancedFeatures }) {
  const location = useLocation();
  const { userId } = useParams() || {};
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const data = await fetchModel(`${BACKEND_URL}/user/${userId}`);
          setUser(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
  }, [userId]);

  let rightText = "";
  if (user) {
    if (location.pathname.startsWith("/photos/")) {
      rightText = `Photos of ${user.first_name} ${user.last_name}`;
    } else if (location.pathname.startsWith("/users/")) {
      rightText = `${user.first_name} ${user.last_name}`;
    }
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit">
          Nghiêm Viết Đức Toàn
        </Typography>
        <Typography variant="h6" color="inherit">
          {rightText}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedFeatures}
              onChange={(e) => setAdvancedFeatures(e.target.checked)}
              sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
            />
          }
          label={
            <Typography variant="body2" color="inherit">
              Enable Advanced Features
            </Typography>
          }
        />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
