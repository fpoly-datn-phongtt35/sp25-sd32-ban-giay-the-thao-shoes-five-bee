package com.example.demo.repository;

import com.example.demo.entity.XuatXuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface XuatXuRepository extends JpaRepository<XuatXuEntity, UUID>, JpaSpecificationExecutor<XuatXuEntity> {
    Optional<XuatXuEntity> findByTenIgnoreCase(String ten);

}
