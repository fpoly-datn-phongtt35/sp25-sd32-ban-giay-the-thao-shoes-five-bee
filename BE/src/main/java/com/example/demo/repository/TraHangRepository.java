package com.example.demo.repository;

import com.example.demo.entity.TraHangChiTietEntity;
import com.example.demo.entity.TraHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TraHangRepository extends JpaRepository<TraHangEntity, UUID> {
    Optional<TraHangEntity> findById(UUID id);
}
