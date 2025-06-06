package com.example.demo.repository;

import com.example.demo.entity.KieuDangEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KieuDangRepository extends JpaRepository<KieuDangEntity, UUID>, JpaSpecificationExecutor<KieuDangEntity> {
    Optional<KieuDangEntity> findByTenIgnoreCase(String ten);

}
