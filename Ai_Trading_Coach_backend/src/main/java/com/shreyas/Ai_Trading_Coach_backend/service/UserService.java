package com.shreyas.Ai_Trading_Coach_backend.service;

import com.shreyas.Ai_Trading_Coach_backend.entity.User;
import com.shreyas.Ai_Trading_Coach_backend.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ➕ CREATE
    public User createUser(User user) {

        // Optional: prevent duplicate email
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already exists");
        });

        return userRepository.save(user);
    }

    // 📥 GET ALL
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔍 GET BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✏️ UPDATE
    public User updateUser(Long id, User updatedUser) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        return userRepository.save(user);
    }

    // ❌ DELETE
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }
}