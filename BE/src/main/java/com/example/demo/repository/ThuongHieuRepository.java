package com.example.demo.repository;

import com.example.demo.entity.ThuongHieuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ThuongHieuRepository extends JpaRepository<ThuongHieuEntity, UUID>, JpaSpecificationExecutor<ThuongHieuEntity> {
    Optional<ThuongHieuEntity> findByTenIgnoreCase(String ten);

}
