package com.example.demo.service;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;

import java.util.List;
import java.util.UUID;

public interface HoaDonChiTietService {
    List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon);
    public byte[] printHoaDonChiTiet(UUID id);
}
