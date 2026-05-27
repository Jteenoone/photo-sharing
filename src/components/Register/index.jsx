import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

function Register() {
  const BACKEND_URL = "https://kxt2z7-8081.csb.app/api";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [passwordAgain, setPasswordAgain] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name
    ) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (formData.password !== passwordAgain) {
      setError("Mật khẩu không khớp");
      return;
    }

    const res = await fetch(`${BACKEND_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess("Đăng ký thành công!");
      setError("");
      setFormData({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
      setPasswordAgain("");
      navigate("/login");
    } else {
      setError(data.message);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, width: 450 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Đăng ký
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <TextField
          label="Tên đăng nhập *"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Họ *"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Tên *"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mật khẩu *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nhập lại mật khẩu *"
          type="password"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Địa chỉ"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Nghề nghiệp"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Register Me
        </Button>
      </Paper>
    </Box>
  );
}

export default Register;
