package com.example.demo.repository;

import com.example.demo.entity.DiaChiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChiEntity, UUID> {
    void deleteByUserEntityId(UUID userId);
}
