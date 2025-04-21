package com.example.demo.repository;

import com.example.demo.entity.ChatLieuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieuEntity, UUID>, JpaSpecificationExecutor<ChatLieuEntity> {
    Optional<ChatLieuEntity> findByTenIgnoreCase(String ten);
}
