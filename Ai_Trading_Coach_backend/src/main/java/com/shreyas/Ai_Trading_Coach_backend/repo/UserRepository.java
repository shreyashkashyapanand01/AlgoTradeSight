package com.shreyas.Ai_Trading_Coach_backend.repo;

import com.shreyas.Ai_Trading_Coach_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}