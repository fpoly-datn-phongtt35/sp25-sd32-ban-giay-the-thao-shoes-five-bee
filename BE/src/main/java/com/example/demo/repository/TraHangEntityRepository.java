package com.example.demo.repository;

import com.example.demo.entity.TraHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TraHangEntityRepository extends JpaRepository<TraHangEntity, UUID> {
}
