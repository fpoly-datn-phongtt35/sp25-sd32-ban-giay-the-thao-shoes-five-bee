package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ThongKeDoanhThuService {
    BigDecimal getDoanhThuNgayHienTai();
    BigDecimal getDoanhThuThangHienTai();
    BigDecimal getDoanhThuNamHienTai();
    BigDecimal getDoanhThuTheoNgayCuThe(LocalDate ngay);
    BigDecimal getDoanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate);
    List<String> getDoanhThuTheoNgay();
    //xong
}
