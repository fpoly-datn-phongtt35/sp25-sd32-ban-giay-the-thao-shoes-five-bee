package com.example.demo.service;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;

import java.util.List;

public interface HoaDonChiTietService {
    List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon);
}
