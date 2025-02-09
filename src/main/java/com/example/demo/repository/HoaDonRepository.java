package com.example.demo.repository;

import com.example.demo.entity.HoaDonEntity;
import com.example.demo.entity.KichCoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, UUID>, JpaSpecificationExecutor<HoaDonEntity> {
//
@Query("SELECT FUNCTION('DATE', h.ngayThanhToan) AS ngay, SUM(h.tongTien) " +
        "FROM HoaDonEntity h WHERE h.trangThai = 1 " +
        "GROUP BY FUNCTION('DATE', h.ngayThanhToan) " +
        "ORDER BY FUNCTION('DATE', h.ngayThanhToan)")
List<Object[]> doanhThuTheoNgay();



}




