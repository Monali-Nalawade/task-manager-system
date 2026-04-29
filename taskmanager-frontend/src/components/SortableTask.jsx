import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function SortableTask({ task, handleEdit, deleteTask }) {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>

      <Card
        sx={{
          borderRadius: 4,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          mb: 2,
          cursor: "grab"
        }}
      >

        <CardContent>

          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            {task.title}
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
            {task.description}
          </Typography>

          <Typography sx={{ color: "white", fontSize: "0.8rem", mt: 1 }}>
            Status: {task.status}
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color:
                task.priority === "HIGH"
                  ? "#ffb3b3"
                  : task.priority === "MEDIUM"
                  ? "#ffd699"
                  : "#b3ffb3"
            }}
          >
            Priority: {task.priority}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>

            <Button
              size="small"
              variant="contained"
              onClick={() => handleEdit(task)}
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </Button>

          </Box>

        </CardContent>

      </Card>

    </div>
  );
}

export default SortableTask;