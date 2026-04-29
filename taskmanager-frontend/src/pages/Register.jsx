import { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Typography, Container, Box } from "@mui/material"; // Added Container & Box
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleRegister = async () => {

  if (!name) {
    toast.error("Name is required");
    return;
  }

  if (!email.includes("@")) {
    toast.error("Enter valid email");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {

    await API.post("/users/register", {
      name,
      email,
      password
    });

    toast.success("Registration successful");
    navigate("/");

  }catch (error) {

     if (error.response && error.response.data) {
       toast.error(error.response.data);
     } else {
       toast.error("Registration failed");
     }

   }

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
        <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 2 }}>
          Register
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          variant="filled"
          sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 1 }}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          variant="filled"
          sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 1 }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="filled"
          sx={{ background: "rgba(255,255,255,0.7)", borderRadius: 1 }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ marginTop: 3, backgroundColor: "#764ba2" }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </motion.div>
    </Box>
  );
}

export default Register;
