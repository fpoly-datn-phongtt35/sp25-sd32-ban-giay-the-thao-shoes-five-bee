package com.example.demo.repository;

import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonEntity;
import com.example.demo.entity.ChuongTrinhGiamSanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiamGiaSanPhamRepository extends JpaRepository<ChuongTrinhGiamSanPhamEntity, UUID>, JpaSpecificationExecutor<ChuongTrinhGiamSanPhamEntity> {}
