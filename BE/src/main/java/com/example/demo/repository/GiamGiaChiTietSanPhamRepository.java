package com.example.demo.repository;

import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import com.example.demo.entity.GiayEntity;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiamGiaChiTietSanPhamRepository
    extends JpaRepository<GiamGiaChiTietSanPhamEntity, UUID>,
        JpaSpecificationExecutor<GiamGiaChiTietSanPhamEntity> {


  @Query("SELECT g FROM GiamGiaChiTietSanPhamEntity g WHERE g.giayChiTiet.id = :id")
  GiamGiaChiTietSanPhamEntity findByGiayChiTiet(@Param("id") UUID id);

  Optional<GiamGiaChiTietSanPhamEntity> findByGiayChiTiet_Id(UUID giayChiTietId);

}
