package com.example.demo.service;

import com.example.demo.dto.request.DanhGiaDto;

import java.util.List;
import java.util.UUID;

public interface DanhGiaService {
    void creteDanhGia(DanhGiaDto danhGiaDto);
    List<DanhGiaDto> getDanhGiaByHoaDonChiTiet(UUID hoaDonChiTietId);
    List<DanhGiaDto> getDanhGiaByProduct(UUID productId);
}
