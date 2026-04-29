import { useEffect, useState } from "react";
import { TextField,Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem, Box } from "@mui/material";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
const [openAssign, setOpenAssign] = useState(false);
const [selectedUserEmail, setSelectedUserEmail] = useState("");

const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  priority: "LOW",
  status: "PENDING",
  dueDate: ""
});

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Update failed");
    }
  };


  const confirmDelete = async () => {
    try {
      await API.delete(`/admin/delete/${selectedUserId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
    setOpenConfirm(false);
  };
const handleTaskChange = (e) => {
  setTaskData({
    ...taskData,
    [e.target.name]: e.target.value
  });
};
const handleAssignTask = async () => {
  try {
    await API.post("/tasks/assign", {
      ...taskData,
      email: selectedUserEmail
    });

    toast.success("Task assigned!");
    setOpenAssign(false);

  } catch (error) {
    console.error(error);
    toast.error("Failed to assign task");
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        paddingTop: "30px",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
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
        <Typography variant="h4" sx={{ mb: 3 }}>
          Admin Panel
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Table sx={{ "& td, & th": { color: "white", fontSize: "1.2rem", fontWeight: "bold" } }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Delete Action</TableCell>
                <TableCell>Assign Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      sx={{
                        color: "white",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.1)",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "& .MuiSvgIcon-root": { color: "white" }
                      }}
                    >
                      <MenuItem key="1" value="USER">USER</MenuItem>
                      <MenuItem key="2" value="ADMIN">ADMIN</MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Button
                      sx={{ color: "#ff4d4d", fontWeight: "bold" }}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setOpenConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                  <Button
                  variant="contained"
                    onClick={() => {
                      setSelectedUserEmail(user.email);
                      setOpenAssign(true);
                    }}
                 sx={{
                            height: "40px",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            border: "1px solid rgba(255,255,255,0.3)",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" }
                          }}
                  >
                    Assign Task
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Container>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined">Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
<Dialog
  open={openAssign}
  onClose={() => setOpenAssign(false)}
  PaperProps={{
    sx: {
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.15)",
      borderRadius: 4,
      border: "1px solid rgba(255,255,255,0.2)",
      color: "white",
      minWidth: 420
    }
  }}
>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
    Assign Task
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      label="Title"
      name="title"
      value={taskData.title}
      onChange={handleTaskChange}
      sx={{
        mb: 2,
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "8px"
        }
      }}
    />

    <TextField
      fullWidth
      label="Description"
      name="description"
      value={taskData.description}
      onChange={handleTaskChange}
      sx={{
        mb: 2,
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "8px"
        }
      }}
    />

    <TextField
      select
      fullWidth
      label="Priority"
      name="priority"
      value={taskData.priority}
      onChange={handleTaskChange}
      sx={{
        mb: 2,
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "8px"
        }
      }}
    >
      <MenuItem key="1" value="LOW">LOW</MenuItem>
      <MenuItem key="2" value="MEDIUM">MEDIUM</MenuItem>
      <MenuItem key="3" value="HIGH">HIGH</MenuItem>
    </TextField>

    <TextField
      select
      fullWidth
      label="Status"
      name="status"
      value={taskData.status}
      onChange={handleTaskChange}
      sx={{
        mb: 2,
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "8px"
        }
      }}
    >
  <MenuItem key="1" value="PENDING">Pending</MenuItem>
  <MenuItem key="2" value="IN_PROGRESS">In Progress</MenuItem>
  <MenuItem key="3" value="COMPLETED">Completed</MenuItem>
    </TextField>

    <TextField
      type="date"
      fullWidth
      name="dueDate"
      value={taskData.dueDate}
      onChange={handleTaskChange}
      sx={{
        mb: 2,
        "& .MuiInputBase-root": {
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "8px"
        }
      }}
    />

  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setOpenAssign(false)}
      variant="outlined"
      sx={{ color: "white", borderColor: "white" }}
    >
      Cancel
    </Button>

    <Button
      onClick={handleAssignTask}
      variant="contained"
      sx={{ background: "#4CAF50" }}
    >
      Assign
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}

export default AdminPanel;
