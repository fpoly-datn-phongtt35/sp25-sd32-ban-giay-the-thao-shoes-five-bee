package com.example.demo.repository;

import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GiamGiaChiTietSanPhamRepository
    extends JpaRepository<GiamGiaChiTietSanPhamEntity, UUID>,
        JpaSpecificationExecutor<GiamGiaChiTietSanPhamEntity> {

  @Query("SELECT g FROM GiamGiaChiTietSanPhamEntity g WHERE g.giayChiTiet.id = :id")
  GiamGiaChiTietSanPhamEntity findByGiayChiTiet(@Param("id") UUID id);
}
