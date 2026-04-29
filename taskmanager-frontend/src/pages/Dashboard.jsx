import { useEffect, useState } from "react";
import {
  Container, Typography, Button, Grid, Card, CardContent, Box,
  TextField, LinearProgress, IconButton, Badge, Menu, MenuItem,
  FormControl, InputLabel, Select, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import "react-big-calendar/lib/css/react-big-calendar.css";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const totalTasks = tasks.length;
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
const [calendarDate, setCalendarDate] = useState(new Date());
const [calendarView, setCalendarView] = useState("month");
const [sortBy, setSortBy] = useState("");
const [notificationAnchor, setNotificationAnchor] = useState(null);
  const navigate = useNavigate();
const [profileAnchor, setProfileAnchor] = useState(null);
const [openView, setOpenView] = useState(false);

const openProfileMenu = (event) => {
  setProfileAnchor(event.currentTarget);
};

const closeProfileMenu = () => {
  setProfileAnchor(null);
};

const handleView = (task) => {
  setSelectedTask(task);
  setOpenView(true);
};

const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "true"
);

const handleThemeToggle = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem("theme", newMode);
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};
const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({format,parse,startOfWeek,getDay,  locales});
  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

const highPriority = tasks.filter(
  (task) => task.priority === "HIGH"
).length;

const mediumPriority = tasks.filter(
  (task) => task.priority === "MEDIUM"
).length;

const lowPriority = tasks.filter(
  (task) => task.priority === "LOW"
).length;

 let filteredTasks = tasks
 .filter(task => {
   return filter === "ALL" || task.status === filter;
 })
 .filter(task =>
   task.title.toLowerCase().includes(search.toLowerCase())
 );

 if(sortBy === "priority"){
   const order = { HIGH:1, MEDIUM:2, LOW:3 };

   filteredTasks = filteredTasks.sort(
     (a,b) => order[a.priority] - order[b.priority]
   );
 }

 if(sortBy === "dueDate"){
   filteredTasks = filteredTasks.sort(
     (a,b) => new Date(a.dueDate) - new Date(b.dueDate)
   );
 }

 if(sortBy === "status"){
   const order = { PENDING:1, IN_PROGRESS:2, COMPLETED:3 };

   filteredTasks = filteredTasks.sort(
     (a,b) => order[a.status] - order[b.status]
   );
 }

const fetchTasks = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await API.get(`/tasks/user?email=${user.email}`);

    setTasks(res.data);
  } catch (err) {
    console.error("Error fetching tasks", err);
  }
};
const handleCalendarSelect = (event) => {

  const task = tasks.find(t => t.id === event.id);

  if(task){
    setSelectedTask(task);
    setOpen(true);
  }

};

const events = tasks
  .filter(task => task.dueDate)
  .map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    allDay: true
  }));

const scrollToTask = (taskId) => {
  const element = document.getElementById(`task-${taskId}`);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
};

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setOpen(true);

  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setOpen(true);
  };

 useEffect(() => {
   const token = localStorage.getItem("token");

   if (!token) {
     navigate("/login");
   } else {
     fetchTasks();
   }
 }, [navigate]);
const getDueStatus = (dueDate) => {

  if (!dueDate) return "normal";

  const today = new Date();
  const due = new Date(dueDate);

  const diff = (due - today) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "overdue";
  if (diff <= 2) return "soon";

  return "normal";
};

const chartData = [
  { name: "Pending", value: pendingTasks },
  { name: "In Progress", value: progressTasks },
  { name: "Completed", value: completedTasks }
];
const COLORS = ["#ffd166", "#8ec5ff", "#b3ffb3"];

const priorityChartData = [
  { name: "High", value: highPriority },
  { name: "Medium", value: mediumPriority },
  { name: "Low", value: lowPriority }
];
const PRIORITY_COLORS = ["#ff6b6b", "#ffd166", "#06d6a0"];

const columns = {
  PENDING: filteredTasks.filter((task) => task.status === "PENDING"),
  IN_PROGRESS: filteredTasks.filter((task) => task.status === "IN_PROGRESS"),
  COMPLETED: filteredTasks.filter((task) => task.status === "COMPLETED")
};

const getProgress = (status) => {
  if (status === "PENDING") return 20;
  if (status === "IN_PROGRESS") return 60;
  if (status === "COMPLETED") return 100;
  return 0;
};
const overdueTaskList = tasks.filter(task => {
  if (!task.dueDate || task.status === "COMPLETED") return false;
  return new Date(task.dueDate) < new Date();
});

const dueSoonTaskList = tasks.filter(task => {
  if (!task.dueDate || task.status === "COMPLETED") return false;

  const diff =
    (new Date(task.dueDate) - new Date()) /
    (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 2;
});
const totalNotifications = overdueTaskList.length + dueSoonTaskList.length;

const openNotifications = (event) => {
  setNotificationAnchor(event.currentTarget);
};

const closeNotifications = () => {
  setNotificationAnchor(null);
};
return (
  <Box
    sx={{
      minHeight: "100vh",
     paddingBottom: "40px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
           color: "white",
           display: "flex",
           flexDirection: "column",
         }}
       >
           <Container maxWidth="xl">
           <Box
             sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               padding: "24px 0",
               width: "100%",
             }}
           >
             <Typography
               variant="h3"
               sx={{ cursor: "pointer", fontWeight: "bold", letterSpacing: 1 }}
               onClick={() => navigate("/")}
             >
               Task Manager
             </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
<Button
  onClick={() => navigate("/admin")}
  sx={{
    color: "white",
    border: "1px solid white",
    borderRadius: "20px",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.2)"
    }
  }}
>
  Admin Panel
</Button>
          {/* NOTIFICATIONS */}
          <Box>
            <motion.div
              animate={totalNotifications > 0 ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <IconButton onClick={(e) => setNotificationAnchor(e.currentTarget)} color="inherit">
                <Badge badgeContent={totalNotifications} color="error">
                  <NotificationsIcon sx={{ fontSize: 32 }} />
                </Badge>
              </IconButton>
            </motion.div>
           <Menu
             anchorEl={notificationAnchor}
             open={Boolean(notificationAnchor)}
             onClose={() => setNotificationAnchor(null)}
             PaperProps={{ sx: { width: 300, mt: 1.5 } }}
           >
             <MenuItem disabled sx={{ opacity: "1 !important", fontWeight: "bold" }}>
               Notifications
             </MenuItem>

             {totalNotifications === 0 ? (
               <MenuItem>No alerts</MenuItem>
             ) : [
               overdueTaskList.map((task) => (
                 <MenuItem
                   key={task.id}
                   onClick={() => { scrollToTask(task.id); setNotificationAnchor(null); }}
                   sx={{ color: "error.main" }}
                 >
                   ⚠ Overdue: {task.title}
                 </MenuItem>
               )),
               dueSoonTaskList.map((task) => (
                 <MenuItem
                   key={task.id}
                   onClick={() => { scrollToTask(task.id); setNotificationAnchor(null); }}
                   sx={{ color: "warning.main" }}
                 >
                   ⏳ Due Soon: {task.title}
                 </MenuItem>
               ))
             ]}
           </Menu>

          </Box>

          {/* PROFILE */}
          <Box>
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} color="inherit">
              <AccountCircleIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              PaperProps={{ sx: { mt: 1.5 } }}
            >
              <MenuItem key="1" onClick={() => { navigate("/profile"); setProfileAnchor(null); }}>Profile</MenuItem>
              <MenuItem key="2" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
    </Container>

  <Container maxWidth="lg">
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4,
        flexWrap: "wrap",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "16px 24px",
        borderRadius: 4,
        backdropFilter: "blur(10px)",
        marginBottom: 4,
      }}
    >
      {/* Search + Add Button Group */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <TextField
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{
            minWidth: "300px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: 3,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(255,255,255,0.4)" },
              "&:hover fieldset": { borderColor: "white" }
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddTask}
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
          + Add Task
        </Button>
      </Box>

      {/* Filter Buttons Group */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
            <motion.div whileHover={{ scale: 1.05 }} key={status}>
              <Button
                variant={filter === status ? "contained" : "outlined"}
                onClick={() => setFilter(status)}
                sx={{
                  borderRadius: "20px",
                  color: "white",
                  borderColor: "white",
                  textTransform: "none",
                  backgroundColor: filter === status ? "rgba(255,255,255,0.3)" : "transparent",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" }
                }}
              >
                {status === "ALL" ? "All" : status === "IN_PROGRESS" ? "In Progress" : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            </motion.div>
          ))}
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ color: "white" }}>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ color: "white", borderRadius: 2, background: "rgba(255,255,255,0.1)" }}
          >
            <MenuItem key="1" value="">None</MenuItem>
            <MenuItem key="2" value="priority">Priority</MenuItem>
            <MenuItem key="3" value="dueDate">Due Date</MenuItem>
            <MenuItem key="4" value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  </Container>


       <Container maxWidth="lg">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
             >
<Grid container spacing={3} sx={{ marginTop: 3 }}>

  <Grid size={{ xs: 12, md: 3 }}>

    <motion.div whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 200 }}>
      <Card
        sx={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 10px 40px rgba(255,255,255,0.3)"
          }
        }}
      >

        <CardContent>
          <Typography variant="h6" sx={{ color: "white" }}>
            Total Tasks
          </Typography>
          <Typography variant="h3" sx={{ color: "white", fontWeight: "bold" }}>
            {totalTasks}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>


  <Grid size={{ xs: 12, md: 3 }}>

    <motion.div whileHover={{ scale: 1.08 }}>
      <Card
        sx={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 10px 40px rgba(255,255,255,0.3)"
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white" }}>
            Pending
          </Typography>
          <Typography variant="h3" sx={{ color: "#ffd699", fontWeight: "bold" }}>
            {pendingTasks}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>


 <Grid size={{ xs: 12, md: 3 }}>

    <motion.div whileHover={{ scale: 1.08 }}>
      <Card
        sx={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 10px 40px rgba(255,255,255,0.3)"
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white" }}>
            In Progress
          </Typography>
          <Typography variant="h3" sx={{ color: "#8ec5ff", fontWeight: "bold" }}>
            {progressTasks}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>


  <Grid size={{ xs: 12, md: 3 }}>

    <motion.div whileHover={{ scale: 1.08 }}>
      <Card
        sx={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.3)",
          textAlign: "center",
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 10px 40px rgba(255,255,255,0.3)"
          }
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white" }}>
            Completed
          </Typography>
          <Typography variant="h3" sx={{ color: "#b3ffb3", fontWeight: "bold" }}>
            {completedTasks}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>
</Grid>

<Grid container spacing={3} sx={{ marginTop: 2 }}>
  {filteredTasks.map((task) => (
<Grid size={{ xs: 12, sm: 6, md: 4 }}
      key={task.id}
        id={`task-${task.id}`}
      sx={{ display: "flex" }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: "100%", display: "flex" }}
      >
        <Card
          elevation={0}
          sx={{
            display: "flex",
            width: "100%",
            height: "400px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            transition: "0.3s",
            position: "relative",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)"
            }
          }}
        >
          {/* Priority Color Sidebar */}
          <Box
            sx={{
              width: "8px",
              flexShrink: 0,
              backgroundColor:
                task.priority === "HIGH" ? "#ff4d4f" :
                task.priority === "MEDIUM" ? "#faad14" : "#52c41a"
            }}
          />

          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              p: 2,
              boxSizing: "border-box",
              "&:last-child": { pb: 2 }
            }}
          >
          <Box sx={{ flex: 1, overflow: "hidden", mb: 1 }}>

             <Typography
               variant="h6"
               sx={{
                 color: "white",
                 fontWeight: "bold",
                 mb: 1,
                 lineHeight: 1.2,
                 display: "-webkit-box",
                 WebkitLineClamp: 1,
                 WebkitBoxOrient: "vertical",
                 overflow: "hidden"
               }}
             >
               {task.title}
             </Typography>


             <Typography
               sx={{
                 color: "rgba(255,255,255,0.7)",
                 fontSize: "0.85rem",
                 mb: 2,
                 lineHeight: 1.5,
                 display: "-webkit-box",
                 WebkitLineClamp: 4,
                 WebkitBoxOrient: "vertical",
                 overflow: "hidden",
                 wordBreak: "break-word",
               }}
             >
               {task.description}
             </Typography>


             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
               <Typography sx={{ color: "white", fontSize: "0.8rem", opacity: 0.9 }}>
                 <strong>Status:</strong> {task.status}
               </Typography>
               <Typography sx={{ color: "white", fontSize: "0.8rem", opacity: 0.8 }}>
                 Due: {task.dueDate || "No deadline"}
               </Typography>
               <Typography
                 sx={{
                   fontSize: "0.85rem",
                   fontWeight: "bold",
                   color: task.priority === "HIGH" ? "#ffb3b3" : task.priority === "MEDIUM" ? "#ffd699" : "#b3ffb3"
                 }}
               >
                 Priority: {task.priority}
               </Typography>
             </Box>
           </Box>

            <Box sx={{ mt: "auto" }}>
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: "white", fontSize: "0.75rem", mb: 0.5 }}>
                  Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getProgress(task.status)}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      backgroundColor: task.status === "COMPLETED" ? "#4caf50" : "#2196f3",
                    },
                  }}
                />
              </Box>

              {/* Indicators */}

              <Box sx={{ minHeight: "32px", mt: 1, display: "flex", alignItems: "center" }}>
                {getDueStatus(task.dueDate) === "overdue" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      background: "rgba(255, 77, 79, 0.2)",
                      border: "1px solid rgba(255, 77, 79, 0.5)",
                      color: "#ff9292",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.7rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      ⚠ Overdue
                    </Typography>
                  </Box>
                )}

                {getDueStatus(task.dueDate) === "soon" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      background: "rgba(255, 173, 20, 0.2)", // Subtle orange glass
                      border: "1px solid rgba(255, 173, 20, 0.5)",
                      color: "#ffd699",
                    }}
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "0.7rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      ⏳ Due Soon
                    </Typography>
                  </Box>
                )}
              </Box>


              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  pt: 1,
                  mt: 1,
                  borderTop: "1px solid rgba(255,255,255,0.15)",
                  position: "relative",
                  zIndex: 2
                }}
              >
                <IconButton size="small" onClick={() => handleView(task)}  sx={{ color: "#00e5ff" }}> {/* High contrast cyan */}
                  <VisibilityIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => handleEdit(task)} sx={{ color: "#ffea00" }}> {/* High contrast yellow */}
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: "#ff1744" }}> {/* High contrast red */}
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

{/* PIE CHART SECTION */}

<Grid container spacing={4} sx={{ marginTop: 5 }} justifyContent="center">

{/* STATUS CHART */}

<Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center" }}>

<motion.div
initial={{ opacity:0, y:40 }}
animate={{ opacity:1, y:0 }}
whileHover={{ scale:1.05 }}
transition={{ duration:0.6 }}
>

<Box
sx={{
width:420,
padding:3,
borderRadius:4,
background:"rgba(255,255,255,0.15)",
backdropFilter:"blur(10px)",
border:"1px solid rgba(255,255,255,0.25)"
}}
>

<Typography
variant="h6"
sx={{
textAlign:"center",
fontWeight:"bold",
color:"#ffffff",
letterSpacing:1,
mb:2,
textShadow:"0px 2px 6px rgba(0,0,0,0.5)"
}}
>
Task Distribution
</Typography>

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie
data={chartData}
dataKey="value"
cx="50%"
cy="50%"
outerRadius={90}
label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
>

{chartData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

<Tooltip
contentStyle={{
backgroundColor:"#1e1e2f",
border:"none",
borderRadius:"8px",
color:"white"
}}
/>

<Legend/>

</PieChart>

</ResponsiveContainer>

</Box>

</motion.div>

</Grid>


{/* PRIORITY CHART */}

<Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center" }}>

<motion.div
initial={{ opacity:0, y:40 }}
animate={{ opacity:1, y:0 }}
whileHover={{ scale:1.05 }}
transition={{ duration:0.6 }}
>

<Box
sx={{
width:420,
padding:3,
borderRadius:4,
background:"rgba(255,255,255,0.15)",
backdropFilter:"blur(10px)",
border:"1px solid rgba(255,255,255,0.25)"
}}
>

<Typography
variant="h6"
sx={{
textAlign:"center",
fontWeight:"bold",
color:"#ffffff",
mb:2
}}
>
Task Priority Breakdown
</Typography>

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie
data={priorityChartData}
dataKey="value"
cx="50%"
cy="50%"
outerRadius={90}
label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
>

{priorityChartData.map((entry,index)=>(
<Cell key={index} fill={PRIORITY_COLORS[index]} />
))}

</Pie>

<Tooltip
contentStyle={{
backgroundColor:"#1e1e2f",
border:"none",
borderRadius:"8px",
color:"white"
}}
/>

<Legend/>

</PieChart>

</ResponsiveContainer>

</Box>

</motion.div>

</Grid>

</Grid>

<Box
  sx={{
    marginTop: 6,
    padding: 3,
    borderRadius: 4,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.25)",
    "& .rbc-calendar": {
      color: "#333",
    }
  }}
>
  <Typography
    variant="h6"
    sx={{
      color: "white",
      fontWeight: "bold",
      marginBottom: 2
    }}
  >
    Task Calendar
  </Typography>

  <div style={{ height: 500, width: "100%" }}>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      onSelectEvent={handleCalendarSelect}
      view={calendarView}
      date={calendarDate}
      onView={(view) => setCalendarView(view)}
      onNavigate={(date) => setCalendarDate(date)}
      views={["month", "week", "day"]}
      popup
      selectable
      style={{
        height: 500,
        background: "white",
        borderRadius: "10px",
        padding: "10px",
        color: "black"
      }}
    />
  </div>
</Box>
<Dialog open={openView} onClose={() => setOpenView(false)}>

  <DialogTitle>Task Details</DialogTitle>

  <DialogContent>

    {selectedTask && (
      <>
        <Typography><b>Title:</b> {selectedTask.title}</Typography>
        <Typography><b>Description:</b> {selectedTask.description}</Typography>
        <Typography><b>Status:</b> {selectedTask.status}</Typography>
        <Typography><b>Priority:</b> {selectedTask.priority}</Typography>
        <Typography><b>Due Date:</b> {selectedTask.dueDate}</Typography>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenView(false)}>Close</Button>
  </DialogActions>
</Dialog>

     <TaskForm
          open={open}
          handleClose={() => {
            setOpen(false);
            setSelectedTask(null);
          }}
          refreshTasks={fetchTasks}
          task={selectedTask}
        />
</motion.div>
      </Container>
    </Box>

  );
}

export default Dashboard;