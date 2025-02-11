package com.example.demo.service.impl;

import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.ThongKeDoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThongKeDoanhThuServiceImpl implements ThongKeDoanhThuService {
    @Autowired
    HoaDonRepository hoaDonRepository;
    @Override
    public BigDecimal getDoanhThuNgayHienTai() {
        return hoaDonRepository.doanhThuNgayHienTai();
    }

    @Override
    public BigDecimal getDoanhThuThangHienTai() {
        return hoaDonRepository.doanhThuThangHienTai();
    }

    @Override
    public BigDecimal getDoanhThuNamHienTai() {
        return hoaDonRepository.doanhThuNamHienTai();
    }

    @Override
    public BigDecimal getDoanhThuTheoNgayCuThe(LocalDate ngay) {
        return hoaDonRepository.doanhThuTheoNgayCuThe(ngay);
    }

    @Override
    public BigDecimal getDoanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate) {
        return hoaDonRepository.doanhThuTheoKhoangNgay(startDate, endDate);
    }

    @Override
    public List<String> getDoanhThuTheoNgay() {
        return hoaDonRepository.doanhThuTheoNgay().stream()
                .map(result -> "Ngày: " + result[0] + ", Doanh thu: " + result[1])
                .collect(Collectors.toList());
    }
}
