package com.example.demo.service;

import com.example.demo.dto.response.DoanhThuResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ThongKeDoanhThuService {
    DoanhThuResponse getDoanhThuNgayHienTai();
    DoanhThuResponse getDoanhThuThangHienTai();
    DoanhThuResponse getDoanhThuNamHienTai();
    DoanhThuResponse getDoanhThuTheoNgayCuThe(LocalDate ngay);
    DoanhThuResponse getDoanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate);

    //xong
}
