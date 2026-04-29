import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem, Box, DialogActions } from "@mui/material";
import API from "../services/api";
import { toast } from "react-toastify";

import { useEffect } from "react";

function TaskForm({ open, handleClose, refreshTasks, task }) {
    const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [status, setStatus] = useState("PENDING");
const [dueDate, setDueDate] = useState("");
const [users, setUsers] = useState([]);
const currentUser = JSON.parse(localStorage.getItem("user"));

useEffect(() => {

  if (currentUser?.role === "ADMIN") {
    API.get("/admin/users").then(res => setUsers(res.data));
  }

  if (task) {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "LOW");
    setStatus(task.status || "PENDING");
    setDueDate(task?.dueDate || "");
  } else {
    setTitle("");
    setDescription("");
    setPriority("LOW");
    setStatus("PENDING");
  }

}, [task]);
  const handleSubmit = async () => {
const user = JSON.parse(localStorage.getItem("user"));
    try {

      if (task) {

        await API.put(`/tasks/${task.id}`, {
          title,
          description,
          priority,
          status,
          dueDate
        });

        toast.success("Task updated successfully");

      } else {

        await API.post("/tasks/create", {
          title,
          description,
          priority,
          status,
          dueDate,
          email: user.email
        });

    toast.success("Task created!");

      }

      refreshTasks();
      handleClose();

    } catch (error) {

      console.error(error);
    toast.error("Failed to save task");

    }

  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(15px)",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          color: "white",
          width: "450px"
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pt: 3 }}>
        {task ? "Edit Task" : "Add New Task"}
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          variant="filled"
            value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
        />

        <TextField
          label="Description"
          fullWidth
          margin="normal"
          variant="filled"
          multiline
          rows={2}
           value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
        />

        <TextField
          select
          label="Priority"
          fullWidth
          margin="normal"
          variant="filled"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          sx={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
        >
          <MenuItem key="1" value="LOW">Low</MenuItem>
          <MenuItem key="2" value="MEDIUM">Medium</MenuItem>
          <MenuItem key="3" value="HIGH">High</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          variant="filled"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ background: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
        >
          <MenuItem key="1" value="PENDING">Pending</MenuItem>
          <MenuItem key="2" value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem key="3" value="COMPLETED">Completed</MenuItem>
        </TextField>

        <TextField
          label="Due Date"
          type="date"
          fullWidth
          margin="normal"
          variant="filled"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            background: "rgba(255,255,255,0.7)",
            borderRadius: 1
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} sx={{ color: "white" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#764ba2",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#667eea" }
          }}
        >
          {task ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskForm;
