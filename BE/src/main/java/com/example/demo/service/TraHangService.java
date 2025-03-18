package com.example.demo.service;

import com.example.demo.dto.request.TraHangChiTietResDto;
import com.example.demo.dto.request.XemTraHangDto;
import com.example.demo.entity.TraHangChiTietEntity;
import com.example.demo.entity.TraHangEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TraHangService {
    // Tạo trả hàng (Bước đầu tạo trả hàng, chỉ tạo entity mà chưa tính toán gì)
    TraHangEntity createTraHang(UUID hoaDonId, List<TraHangChiTietResDto> traHangChiTietResDtos);

    // Hủy trả hàng (Không tính toán gì, chỉ thay đổi trạng thái của trả hàng)
    void cancelTraHang(UUID traHangId);

    // Xác nhận trả hàng (Thực hiện các thay đổi như số lượng, tồn kho, tổng tiền hoàn trả)
    void confirmTraHang(UUID traHangId);
    List<XemTraHangDto> getProductsReturned(UUID hoaDonId);

    Optional<TraHangEntity> findById(UUID traHangId);
}
