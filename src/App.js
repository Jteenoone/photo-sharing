import "./App.css";
import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

const BACKEND_URL = "https://kxt2z7-8081.csb.app/api";

const App = () => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const isLogin = !!token;

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      fetch(`${BACKEND_URL}/user/me`, {
        headers: { Authorization: "Bearer " + savedToken },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Token invalid");
        })
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.log("Lỗi:", err.message);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Trang login riêng */}
        <Route
          path="/login"
          element={
            isLogin ? (
              <Navigate to="/users" />
            ) : (
              <Login setToken={setToken} setUser={setUser} />
            )
          }
        />

        <Route
          path="/register"
          element={isLogin ? <Navigate to="/users" /> : <Register />}
        />

        {/* Các trang chính */}
        <Route
          path="/*"
          element={
            !isLogin ? (
              <Navigate to="/login" />
            ) : (
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TopBar
                      advancedFeatures={advancedFeatures}
                      setAdvancedFeatures={setAdvancedFeatures}
                      userInfo={user}
                      onLogout={handleLogout}
                    />
                  </Grid>

                  <div className="main-topbar-buffer" />

                  <Grid item sm={3}>
                    <Paper className="main-grid-item">
                      <UserList token={token} user={user} />
                    </Paper>
                  </Grid>

                  <Grid item sm={9}>
                    <Paper className="main-grid-item">
                      <Routes>
                        <Route
                          path="/users/:userId"
                          element={<UserDetail token={token} />}
                        />
                        <Route
                          path="/me"
                          element={<Profile user={user} token={token} />}
                        />
                        <Route
                          path="/photos/:userId/:photoIndex"
                          element={
                            <UserPhotos
                              token={token}
                              user={user}
                              advancedFeatures={advancedFeatures}
                            />
                          }
                        />

                        <Route
                          path="/photos/:userId"
                          element={
                            <UserPhotos
                              token={token}
                              user={user}
                              advancedFeatures={advancedFeatures}
                            />
                          }
                        />

                        <Route
                          path="/comments/:userId"
                          element={<UserComments token={token} />}
                        />

                        <Route
                          path="/users"
                          element={<UserList token={token} user={user} />}
                        />

                        <Route path="/" element={<Navigate to="/users" />} />
                      </Routes>
                    </Paper>
                  </Grid>
                </Grid>
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
