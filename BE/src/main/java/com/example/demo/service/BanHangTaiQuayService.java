package com.example.demo.service;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import java.util.List;
import java.util.UUID;

public interface BanHangTaiQuayService {
  void thanhToanTaiQuay(
      UUID idHoaDon,
      UUID idGiamGia,
      Integer hinhThucThanhToan,
      Boolean isGiaoHang,
      HoaDonRequest hoaDonRequest);

  HoaDonEntity createHoaDonBanHangTaiQuay();

  HoaDonChiTietEntity themSanPhamVaoHoaDon(UUID idHoaDon, UUID idSanPham);

  HoaDonChiTietEntity updateSoLuongGiay(UUID idHoaDonChiTiet, boolean isIncrease);

  List<HoaDonChiTietEntity> getSanPhamTrongHoaDon(UUID idHoaDon);

  List<HoaDonEntity> getListHoaDonCho();

  void deleteHoaDonCho(UUID idHoaDon);

  void deleteAllHoaDonCho(List<UUID> idHoaDons);

  void deleteHoaDonChiTiet(UUID idHoaDonChiTiet);
}
