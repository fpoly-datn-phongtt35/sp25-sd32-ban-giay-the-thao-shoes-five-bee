package com.example.demo.repository;

import com.example.demo.dto.request.BestSellingProductDTO;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
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



}
