package com.example.demo.repository;

import com.example.demo.entity.TraHangChiTietEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TraHangChiTietEntityRepository extends JpaRepository<TraHangChiTietEntity, UUID> {
    @Query("SELECT COALESCE(SUM(t.soLuongTra), 0) FROM TraHangChiTietEntity t WHERE t.hoaDonChiTietEntity.id = :hoaDonChiTietId")
    int findTongSoLuongTraByHoaDonChiTiet(@Param("hoaDonChiTietId") UUID hoaDonChiTietId);
}
