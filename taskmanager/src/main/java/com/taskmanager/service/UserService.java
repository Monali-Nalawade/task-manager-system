package com.taskmanager.service;

import com.taskmanager.dto.UserUpdateRequest;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User updateUser(String email, UserUpdateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User register(User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.count() == 0) {
            user.setRole("ADMIN");
        } else {
            user.setRole("USER");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
            return user.get();
        }


        return null;
    }

    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }
}