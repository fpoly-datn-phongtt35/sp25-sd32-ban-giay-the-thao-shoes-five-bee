package com.example.demo.repository;

import com.example.demo.entity.HoaDonEntity;
import com.example.demo.entity.KichCoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, UUID>, JpaSpecificationExecutor<HoaDonEntity> {

    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 1 AND FUNCTION('DATE', h.ngayThanhToan) = FUNCTION('CURRENT_DATE')")
    BigDecimal doanhThuNgayHienTai();


    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 1 AND YEAR(h.ngayThanhToan) = YEAR(CURRENT_DATE) " +
            "AND MONTH(h.ngayThanhToan) = MONTH(CURRENT_DATE)")
    BigDecimal doanhThuThangHienTai();


    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 1 AND YEAR(h.ngayThanhToan) = YEAR(CURRENT_DATE)")
    BigDecimal doanhThuNamHienTai();


    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 1 AND FUNCTION('DATE', h.ngayThanhToan) = :ngay")
    BigDecimal doanhThuTheoNgayCuThe(LocalDate ngay);


    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 1 AND FUNCTION('DATE', h.ngayThanhToan) " +
            "BETWEEN :startDate AND :endDate")
    BigDecimal doanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate);


    @Query("SELECT FUNCTION('DATE', h.ngayThanhToan), SUM(h.tongTien)" +
            " FROM HoaDonEntity h WHERE h.trangThai = 1 GROUP BY FUNCTION" +
            "('DATE', h.ngayThanhToan) ORDER BY FUNCTION('DATE', h.ngayThanhToan)")
    List<Object[]> doanhThuTheoNgay();




}




