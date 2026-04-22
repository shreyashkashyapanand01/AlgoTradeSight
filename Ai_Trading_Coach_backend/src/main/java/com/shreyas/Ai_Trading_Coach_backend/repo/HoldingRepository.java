package com.shreyas.Ai_Trading_Coach_backend.repo;

import com.shreyas.Ai_Trading_Coach_backend.entity.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoldingRepository extends JpaRepository<Holding, Long> {

    List<Holding> findByUserId(Long userId);
}