package com.example.demo.service;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.entity.HoaDonEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrangThaiHoaDonService {
    HoaDonEntity xacNhanHoaDon(UUID id);
    HoaDonEntity huyHoaDon(UUID id);
    List<HoaDonDto> getAllHoaDon();
    Optional<HoaDonEntity> findById(UUID id);
    public byte[] printHoaDon(UUID id);
    List<HoaDonEntity> getHoaDonByUserId(UUID userId);
}
