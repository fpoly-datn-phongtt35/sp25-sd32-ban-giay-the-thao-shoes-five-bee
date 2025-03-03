package com.example.demo.repository;

import com.example.demo.entity.GiamGiaHoaDonEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GiamGiaHoaDonRepository
    extends JpaRepository<GiamGiaHoaDonEntity, UUID>,
        JpaSpecificationExecutor<GiamGiaHoaDonEntity> {

  GiamGiaHoaDonEntity findByMa(String ten);

  @Query("SELECT g FROM GiamGiaHoaDonEntity g WHERE g.soLuong > 0 ORDER BY g.phanTramGiam DESC")
  List<GiamGiaHoaDonEntity> findGiamGiaConSoLuong();
}
