package com.example.demo.repository;

import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiayEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface GiamGiaChiTietSanPhamRepository
    extends JpaRepository<GiamGiaChiTietSanPhamEntity, UUID>,
        JpaSpecificationExecutor<GiamGiaChiTietSanPhamEntity> {

  @Query(
      "SELECT g FROM GiamGiaChiTietSanPhamEntity g WHERE g.giayChiTiet.id = :id AND g.trangThai = 0 ORDER BY g.ngayBatDau DESC")
  List<GiamGiaChiTietSanPhamEntity> findByGiayChiTiet(@Param("id") UUID id);

  @Query(
          "SELECT g FROM GiamGiaChiTietSanPhamEntity g WHERE g.chuongTrinhGiamSanPhamEntity.id = :id AND g.trangThai = 0")
  List<GiamGiaChiTietSanPhamEntity> findByGiayChiTietByGiamGiaSanPham(@Param("id") UUID id);

  @Modifying
  @Transactional
  @Query("DELETE FROM GiamGiaChiTietSanPhamEntity f WHERE f.chuongTrinhGiamSanPhamEntity.id = :id")
  void deleteByGiamGiaSanPhamId(@Param("id") UUID id);

  Optional<GiamGiaChiTietSanPhamEntity> findByGiayChiTiet_Id(UUID giayChiTietId);
}
