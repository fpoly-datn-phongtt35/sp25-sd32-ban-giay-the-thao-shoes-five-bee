package com.example.demo.repository;

import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GioHangRepository extends JpaRepository<GioHangEntity, UUID> {
    Optional<GioHangEntity> findByUserEntity(UserEntity userEntity);
}
