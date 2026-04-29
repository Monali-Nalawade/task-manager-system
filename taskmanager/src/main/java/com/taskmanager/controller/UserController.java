package com.taskmanager.controller;

import com.taskmanager.dto.UserUpdateRequest;
import com.taskmanager.entity.User;
import com.taskmanager.security.JwtUtil;
import com.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {

        try {

            User savedUser = userService.register(user);
            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UserUpdateRequest request) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User updated = userService.updateUser(email, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.findByEmail(email);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User loggedUser = userService.login(user.getEmail(), user.getPassword());

        if (loggedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                loggedUser.getEmail(),
                loggedUser.getRole()
        );
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", loggedUser.getRole());
        response.put("user", loggedUser);

        return ResponseEntity.ok(response);
    }
}