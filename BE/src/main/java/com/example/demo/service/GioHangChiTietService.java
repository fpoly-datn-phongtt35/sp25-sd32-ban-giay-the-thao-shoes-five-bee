package com.example.demo.service;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.UserEntity;

import java.util.UUID;


public interface GioHangChiTietService {
    void addToCart(UUID idGiayChiTiet, Integer soLuong);
    GioHangChiTietEntity updateSoLuongGiay(UUID idGioHangChiTiet, boolean isIncrease);
    void deleteSanPhamTrongGioHang(UUID idGioHangChiTiet);
    Integer getTotalProductsInCart(UUID idGioHang);
}
