package com.example.demo.repository;

import com.example.demo.entity.GiamGiaHoaDonChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiamGiaHoaDonChiTietRepository extends JpaRepository<GiamGiaHoaDonChiTietEntity, UUID>, JpaSpecificationExecutor<GiamGiaHoaDonChiTietEntity> {}
