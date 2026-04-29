import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Profile = () => {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (!user?.email) {
        toast.error("Please login again");
        return;
      }

      const response = await API.put("/users/update", {
        email: user.email,
        name: user.name
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
      setEditMode(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  const handleCancel = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Invalid user data");
    }
    setEditMode(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        pt: 4
      }}
    >
      <Container maxWidth="xl">

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", cursor: "pointer", letterSpacing: 1 }}
            onClick={() => navigate("/")}
          >
            Task Manager
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              width: 420,
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
            }}
          >
            <Typography variant="h5" textAlign="center" mb={3}>
              My Profile
            </Typography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={user?.name || ""}
              onChange={handleChange}
              disabled={!editMode}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              value={user?.email || ""}
              disabled
              sx={{
                mb: 2,
                "& .MuiInputBase-root": {
                  backgroundColor: "rgba(255,255,255,0.1)"
                }
              }}
            />

            <Box display="flex" gap={2}>
              {editMode ? (
                <>
                  <Button fullWidth variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: "white", borderColor: "white" }}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Profile;