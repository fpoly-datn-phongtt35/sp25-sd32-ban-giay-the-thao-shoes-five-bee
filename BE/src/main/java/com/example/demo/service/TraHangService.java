package com.example.demo.service;

import com.example.demo.dto.request.TraHangChiTietResDto;
import com.example.demo.entity.TraHangEntity;

import java.util.List;
import java.util.UUID;

public interface TraHangService {
    List<TraHangEntity> getAll();
    TraHangEntity traHang(UUID hoaDonId, List<TraHangChiTietResDto> traHangChiTietResDtos);
}
