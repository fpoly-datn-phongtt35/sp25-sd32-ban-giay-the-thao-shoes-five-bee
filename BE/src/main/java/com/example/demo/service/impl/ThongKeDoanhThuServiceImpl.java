package com.example.demo.service.impl;

import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.ThongKeDoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ThongKeDoanhThuServiceImpl implements ThongKeDoanhThuService {
    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Override
    public BigDecimal getDoanhThuNgayHienTai() {
        return Optional.ofNullable(hoaDonRepository.doanhThuNgayHienTai()).orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal getDoanhThuThangHienTai() {
        return Optional.ofNullable(hoaDonRepository.doanhThuThangHienTai()).orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal getDoanhThuNamHienTai() {
        return Optional.ofNullable(hoaDonRepository.doanhThuNamHienTai()).orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal getDoanhThuTheoNgayCuThe(LocalDate ngay) {
        return Optional.ofNullable(hoaDonRepository.doanhThuTheoNgayCuThe(ngay)).orElse(BigDecimal.ZERO);
    }

    @Override
    public BigDecimal getDoanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate) {
        return Optional.ofNullable(hoaDonRepository.doanhThuTheoKhoangNgay(startDate, endDate)).orElse(BigDecimal.ZERO);
    }

    @Override
    public List<String> getDoanhThuTheoNgay() {
        return hoaDonRepository.doanhThuTheoNgay().stream()
                .map(result -> String.format("Ngày: %s, Doanh thu: %s",
                        Objects.toString(result[0], "Không xác định"),
                        Objects.toString(result[1], "0")))
                .collect(Collectors.toList());
    }
}
