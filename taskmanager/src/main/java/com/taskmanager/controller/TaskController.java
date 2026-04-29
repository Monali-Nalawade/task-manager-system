package com.taskmanager.controller;

import com.taskmanager.entity.User;
import com.taskmanager.entity.Task;
import com.taskmanager.enums.TaskStatus;
import com.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.taskmanager.enums.Priority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public Task createTask(@RequestBody Map<String, Object> data) {

        Task task = new Task();
        task.setTitle((String) data.get("title"));
        task.setDescription((String) data.get("description"));
        task.setStatus(TaskStatus.valueOf((String) data.get("status")));

        task.setDueDate(
                LocalDate.parse((String) data.get("dueDate"))
        );
        task.setPriority(
                Priority.valueOf((String) data.get("priority"))
        );

        String email = (String) data.get("email");

        return taskService.createTask(task, email);
    }


    @GetMapping("/tasks")
    public List<Task> getMyTasks(@RequestParam("email") String email) {
        return taskService.getTasksByUser(email);
    }

    @GetMapping("/user")
    public List<Task> getTasksByUser(@RequestParam String email) {
        return taskService.getTasksByUser(email);
    }

    @PostMapping("/assign")
    public Task assignTask(@RequestBody Map<String, Object> data) {

        Task task = new Task();

        task.setTitle((String) data.get("title"));
        task.setDescription((String) data.get("description"));
        task.setPriority(Priority.valueOf((String) data.get("priority")));
        task.setStatus(TaskStatus.valueOf((String) data.get("status")));
        task.setDueDate(LocalDate.parse((String) data.get("dueDate")));

        String userEmail = (String) data.get("email");
        return taskService.assignTaskToUser(task, userEmail);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }
}