package com.example.demo.service.impl;

import com.example.demo.dto.response.DoanhThuResponse;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.ThongKeDoanhThuService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThongKeDoanhThuServiceImpl implements ThongKeDoanhThuService {
    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Override
    public DoanhThuResponse getDoanhThuNgayHienTai() {
        BigDecimal doanhThu = Optional.ofNullable(hoaDonRepository.doanhThuNgayHienTai()).orElse(BigDecimal.ZERO);
        return new DoanhThuResponse("Doanh thu ngày hiện tại", doanhThu);
    }

    @Override
    public DoanhThuResponse getDoanhThuThangHienTai() {
        BigDecimal doanhThu = Optional.ofNullable(hoaDonRepository.doanhThuThangHienTai()).orElse(BigDecimal.ZERO);
        return new DoanhThuResponse("Doanh thu tháng hiện tại", doanhThu);
    }

    @Override
    public DoanhThuResponse getDoanhThuNamHienTai() {
        BigDecimal doanhThu = Optional.ofNullable(hoaDonRepository.doanhThuNamHienTai()).orElse(BigDecimal.ZERO);
        return new DoanhThuResponse("Doanh thu năm hiện tại", doanhThu);
    }

    @Override
    public DoanhThuResponse getDoanhThuTheoNgayCuThe(LocalDate ngay) {
        BigDecimal doanhThu = Optional.ofNullable(hoaDonRepository.doanhThuTheoNgayCuThe(ngay)).orElse(BigDecimal.ZERO);
        return new DoanhThuResponse("Doanh thu ngày: " + ngay, doanhThu);
    }

    @Override
    public DoanhThuResponse getDoanhThuTheoKhoangNgay(LocalDate startDate, LocalDate endDate) {
        BigDecimal doanhThu = Optional.ofNullable(hoaDonRepository.doanhThuTheoKhoangNgay(startDate, endDate)).orElse(BigDecimal.ZERO);
        return new DoanhThuResponse("Doanh thu từ " + startDate + " đến " + endDate, doanhThu);
    }
}

