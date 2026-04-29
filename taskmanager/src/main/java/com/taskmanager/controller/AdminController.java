package com.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

import com.taskmanager.repository.UserRepository;
import com.taskmanager.entity.User;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Update role
    @PutMapping("/users/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(body.get("role"));
        return userRepository.save(user);
    }

    // Delete user
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}