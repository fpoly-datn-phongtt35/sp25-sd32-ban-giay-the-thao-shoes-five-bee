package com.example.demo.repository;

import com.example.demo.entity.HoaDonEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDonEntity, UUID>, JpaSpecificationExecutor<HoaDonEntity> {
    // thanh toán onl sẽ lên đầu của quản lý hóa đơn
    List<HoaDonEntity> findAllByOrderByTrangThaiDescNgayThanhToanDesc();

    Optional<HoaDonEntity> findByMa(String maHoaDon);

    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND CAST(h.ngayThanhToan AS DATE) = CAST(GETDATE() AS DATE)")
    BigDecimal doanhThuNgayHienTai();

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND YEAR(h.ngayThanhToan) = YEAR(CURRENT_TIMESTAMP) " +
            "AND MONTH(h.ngayThanhToan) = MONTH(CURRENT_TIMESTAMP)")
    BigDecimal doanhThuThangHienTai();


    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND YEAR(h.ngayThanhToan) = YEAR(CURRENT_TIMESTAMP)")
    BigDecimal doanhThuNamHienTai();

    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND CAST(h.ngayThanhToan AS DATE) = :ngay")
    BigDecimal doanhThuTheoNgayCuThe(LocalDate ngay);

    @Query("SELECT SUM(h.tongTien) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND CAST(h.ngayThanhToan AS DATE) " +
            "BETWEEN :startDate AND :endDate")
    BigDecimal doanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate);

    @Query("SELECT CAST(h.ngayThanhToan AS DATE), SUM(h.tongTien) " +
            "FROM HoaDonEntity h WHERE h.trangThai = 2 " +
            "GROUP BY CAST(h.ngayThanhToan AS DATE) " +
            "ORDER BY CAST(h.ngayThanhToan AS DATE)")
    List<Object[]> doanhThuTheoNgay();

    @Query("select h from HoaDonEntity h where h.trangThai = 1 and h.hinhThucMua=1 order by h.ngayTao")
    List<HoaDonEntity> getListByTrangThai();
    //xong

    @Query("select h from HoaDonEntity h where h.id in :ids ")
    List<HoaDonEntity> findAllById(List<UUID> ids);

    Optional<HoaDonEntity> findById(UUID id);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND YEAR(h.ngayThanhToan) = :year " +
            "AND MONTH(h.ngayThanhToan) = :month")
    BigDecimal doanhThuTheoThangCuThe(int year, int month);

    // Doanh thu theo năm cụ thể
    @Query("SELECT COALESCE(SUM(h.tongTien), 0) FROM HoaDonEntity h " +
            "WHERE h.trangThai = 2 AND YEAR(h.ngayThanhToan) = :year")
    BigDecimal doanhThuTheoNamCuThe(int year);

    @Query("SELECT h FROM HoaDonEntity h WHERE h.userEntity.id = :userId")
    List<HoaDonEntity> findByUserId(@Param("userId") UUID userId);
}
