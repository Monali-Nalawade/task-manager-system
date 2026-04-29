import { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Typography, Link, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [emailError, setEmailError] = useState("");
const [passwordError, setPasswordError] = useState("");

useEffect(() => {

  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }

}, []);

const handleLogin = async () => {

  if (!email || !password) {
    toast.error("Please enter email and password");
    return;
  }

  if (!email.includes("@")) {
    toast.error("Please enter a valid email");
    return;
  }

  try {

    const response = await API.post("/users/login", {
      email: email,
      password: password
    });


const role = response.data.role;
localStorage.setItem("token", response.data.token);
localStorage.setItem("role", role);
localStorage.setItem("user", JSON.stringify(response.data.user));
toast.success("Login is successfull");
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
toast.error("Invalid email or password");  }

};

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <Typography variant="h4" align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
          Task Manager
        </Typography>

        <Typography variant="subtitle1" align="center" sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}>
          Login to your account
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="filled"
          value={email}
           error={Boolean(emailError)}
           helperText={emailError}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 1 }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="filled"
          value={password}
          error={Boolean(passwordError)}
          helperText={passwordError}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 1 }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ marginTop: 3, backgroundColor: "#764ba2" }}
          onClick={handleLogin}
          disabled={!email || !password}
        >
          Login
        </Button>

        <Typography align="center" sx={{ marginTop: 3, color: "#fff" }}>
          Don't have an account?{" "}
          <Link
            onClick={() => navigate("/register")}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Register
          </Link>
        </Typography>
      </motion.div>
    </Box>
  );
}

export default Login;
