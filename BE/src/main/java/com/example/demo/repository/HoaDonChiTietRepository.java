package com.example.demo.repository;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface HoaDonChiTietRepository
    extends JpaRepository<HoaDonChiTietEntity, UUID>,
        JpaSpecificationExecutor<HoaDonChiTietEntity> {

  @Query("SELECT h FROM HoaDonChiTietEntity h  WHERE h.hoaDonEntity = :hoaDon")
  List<HoaDonChiTietEntity> findByHoaDon(HoaDonEntity hoaDon);

  @Query("SELECT h FROM HoaDonChiTietEntity h JOIN FETCH h.giayChiTietEntity WHERE h.hoaDonEntity = :hoaDon")
  List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(@Param("hoaDon") HoaDonEntity hoaDon);

  HoaDonChiTietEntity findByHoaDonEntityAndGiayChiTietEntity(HoaDonEntity hoaDon, GiayChiTietEntity giayChiTiet);


  List<HoaDonChiTietEntity> findAllByHoaDonEntity_Id(UUID hoaDonId);
  
}
