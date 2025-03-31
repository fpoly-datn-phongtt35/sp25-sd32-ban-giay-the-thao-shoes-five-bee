package com.example.demo.repository;

import com.example.demo.entity.MauSacEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MauSacRepository extends JpaRepository<MauSacEntity, UUID>, JpaSpecificationExecutor<MauSacEntity> {
    public boolean existsByTenIgnoreCase(String ten);


}
