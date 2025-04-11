package com.example.demo.repository;

import com.example.demo.dto.request.BestSellingProductDTO;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

  Optional<HoaDonChiTietEntity> findByHoaDonEntityIdAndGiayChiTietEntityId(UUID hoaDonId, UUID giayChiTietId);

  @Query("SELECT new com.example.demo.dto.request.BestSellingProductDTO(" +
          "hde.giayChiTietEntity.giayEntity.ten, " +  // Tên giày
          "hde.giayChiTietEntity.mauSacEntity.ten, " + // Màu sắc
          "hde.giayChiTietEntity.kichCoEntity.ten, " + // Kích cỡ
          "hde.giayChiTietEntity.giayEntity.danhMuc.ten, " + // Danh mục
          "hde.giayChiTietEntity.giayEntity.thuongHieu.ten, " + // Thương hiệu
          "MAX(ag.tenUrl), " + // Lấy URL của ảnh đầu tiên
          "SUM(hde.soLuong)) " +  // Tổng số lượng bán
          "FROM HoaDonChiTietEntity hde " +
          "JOIN hde.hoaDonEntity hd " +
          "LEFT JOIN hde.giayChiTietEntity.danhSachAnh ag " + // Join với danh sách ảnh giày
          "WHERE hd.trangThai = 2 " +  // Trạng thái hóa đơn là hoàn thành
          "GROUP BY hde.giayChiTietEntity.giayEntity.ten, " +
          "hde.giayChiTietEntity.mauSacEntity.ten, " +
          "hde.giayChiTietEntity.kichCoEntity.ten, " +
          "hde.giayChiTietEntity.giayEntity.danhMuc.ten, " +
          "hde.giayChiTietEntity.giayEntity.thuongHieu.ten " + // Nhóm theo tên giày, màu sắc, kích cỡ, danh mục, thương hiệu
          "ORDER BY SUM(hde.soLuong) DESC")  // Sắp xếp theo tổng số lượng bán
  List<BestSellingProductDTO> findTopSellingProductsWithVariants(PageRequest pageRequest);


  @Query("SELECT SUM(hdct.soLuong) " +
          "FROM HoaDonChiTietEntity hdct " +
          "WHERE hdct.hoaDonEntity.userEntity.id = :userId AND hdct.trangThai = 2")
  Integer getTongSoLuong(@Param("userId") UUID userId);

  @Query("SELECT SUM(hdct.soLuong * hdct.donGia) " +
          "FROM HoaDonChiTietEntity hdct " +
          "WHERE hdct.hoaDonEntity.userEntity.id = :userId AND hdct.trangThai = 2")
  BigDecimal getTongTien(@Param("userId") UUID userId);

  @Query("SELECT g.thuongHieu.ten, COUNT(hdct.id) AS sl " +
          "FROM HoaDonChiTietEntity hdct " +
          "JOIN hdct.giayChiTietEntity gct " +
          "JOIN gct.giayEntity g " +
          "WHERE hdct.hoaDonEntity.userEntity.id = :userId AND hdct.trangThai = 2 " +
          "GROUP BY g.thuongHieu.ten " +
          "ORDER BY sl DESC")
  List<Object[]> getTopThuongHieu(@Param("userId") UUID userId);

  @Query("SELECT gct.mauSacEntity.ten, COUNT(hdct.id) AS sl " +
          "FROM HoaDonChiTietEntity hdct " +
          "JOIN hdct.giayChiTietEntity gct " +
          "WHERE hdct.hoaDonEntity.userEntity.id = :userId AND hdct.trangThai = 2 " +
          "GROUP BY gct.mauSacEntity.ten " +
          "ORDER BY sl DESC")
  List<Object[]> getTopMauSac(@Param("userId") UUID userId);

//  @Query("SELECT " +
//          "SUM(hdct.soLuong) AS tongSoLuong, " +
//          "SUM(hdct.soLuong * hdct.donGia) AS tongTien, " +
//          "(SELECT g.thuongHieu.ten " +
//          " FROM HoaDonChiTietEntity hdct2 " +
//          " JOIN hdct2.giayChiTietEntity gct2 " +
//          " JOIN gct2.giayEntity g " +
//          " WHERE hdct2.hoaDonEntity.userEntity.id = :userId AND hdct2.trangThai = 2 " +
//          " GROUP BY g.thuongHieu.ten " +
//          " ORDER BY COUNT(hdct2.id) DESC " +
//          " LIMIT 1), " +
//          "(SELECT gct3.mauSacEntity.ten " +
//          " FROM HoaDonChiTietEntity hdct3 " +
//          " JOIN hdct3.giayChiTietEntity gct3 " +
//          " WHERE hdct3.hoaDonEntity.userEntity.id = :userId AND hdct3.trangThai = 2 " +
//          " GROUP BY gct3.mauSacEntity.ten " +
//          " ORDER BY COUNT(hdct3.id) DESC " +
//          " LIMIT 1) " +
//          "FROM HoaDonChiTietEntity hdct " +
//          "WHERE hdct.hoaDonEntity.userEntity.id = :userId AND hdct.trangThai = 2")
//  Object[] thongKeMuaHangByUserId(@Param("userId") UUID userId);



}
