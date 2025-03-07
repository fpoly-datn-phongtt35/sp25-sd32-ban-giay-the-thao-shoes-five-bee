package com.example.demo.service;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;

import java.util.UUID;

public interface UpdateHoaDonService {
    HoaDonEntity updateHoaDonAddress(UUID hoaDonId, String tenNguoiNhan, String sdtNguoiNhan, String xa, String huyen, String tinh, String diaChi);
    HoaDonChiTietEntity updateSoLuongSanPham(UUID hoaDonChiTietId, boolean isIncrease);
    void removeSanPhamKhoiHoaDon(UUID hoaDonChiTietId);
    HoaDonChiTietEntity themSanPhamVaoHoaDon(UUID hoaDonId, UUID giayChiTietId);
}
