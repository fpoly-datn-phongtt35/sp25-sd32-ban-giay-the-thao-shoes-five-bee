package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class XemTraHangDto {
    private UUID hoaDonChiTietId;  // ID chi tiết hóa đơn
    private String tenSanPham;    // Tên sản phẩm
    private Integer soLuongTra;    // Số lượng đã trả
    private BigDecimal giaHoanTra; // Giá trị hoàn trả
}
