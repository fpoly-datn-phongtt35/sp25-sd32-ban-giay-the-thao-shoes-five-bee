package com.example.demo.service;

import com.example.demo.dto.request.UpdateAddressBillRequest;
import com.example.demo.dto.request.UpdateQuantityRequest;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;

import java.util.List;
import java.util.UUID;

public interface HoaDonChiTietService {
    HoaDonEntity updateAddress(UUID idHoaDon, UpdateAddressBillRequest updateAddressBillRequest);
    HoaDonChiTietEntity updateQuantity(UUID id, UUID idGiayChiTiet , UpdateQuantityRequest updateQuantityRequest);
    List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon);
    public byte[] printHoaDonChiTiet(UUID id);
    boolean capNhatDiaChi(UUID hoaDonId,UUID diaChiId);
}
