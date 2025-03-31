package com.example.demo.repository;

import com.example.demo.entity.LichSuHoaDonEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LichSuHoaDonRepository
    extends JpaRepository<LichSuHoaDonEntity, UUID>, JpaSpecificationExecutor<LichSuHoaDonEntity> {

  @Query("SELECT l FROM LichSuHoaDonEntity  l WHERE l.hoaDonEntity.id = :hoaDonId")
  List<LichSuHoaDonEntity> getListLichSuHoaDonByHoaDonId(@Param("hoaDonId") UUID hoaDonId);
}
