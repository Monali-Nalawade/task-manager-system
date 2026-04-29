package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.taskmanager.entity.User;


public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);

    List<Task> findByUserEmail(String email);

}