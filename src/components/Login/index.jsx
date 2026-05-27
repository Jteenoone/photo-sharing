import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

function Login({ setToken, setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = "https://kxt2z7-8081.csb.app/api";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Đăng nhập
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TextField
          label="Tên đăng nhập"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Đăng nhập
        </Button>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            Đăng ký
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
