package com.example.demo.controller;

import com.example.demo.dto.response.DoanhThuResponse;
import com.example.demo.service.ThongKeDoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/doanh-thu")
public class DoanhThuController {
    @Autowired
    private ThongKeDoanhThuService thongKeDoanhThuService;

    @GetMapping("/ngay-hien-tai")
    public DoanhThuResponse getDoanhThuNgayHienTai() {
        return thongKeDoanhThuService.getDoanhThuNgayHienTai();
    }

    @GetMapping("/thang-hien-tai")
    public DoanhThuResponse getDoanhThuThangHienTai() {
        return thongKeDoanhThuService.getDoanhThuThangHienTai();
    }

    @GetMapping("/nam-hien-tai")
    public DoanhThuResponse getDoanhThuNamHienTai() {
        return thongKeDoanhThuService.getDoanhThuNamHienTai();
    }

    @GetMapping("/ngay-cu-the")
    public DoanhThuResponse getDoanhThuTheoNgayCuThe(@RequestParam("ngay") String ngay) {
        LocalDate date = LocalDate.parse(ngay);
        return thongKeDoanhThuService.getDoanhThuTheoNgayCuThe(date);
    }

    @GetMapping("/khoang-ngay")
    public DoanhThuResponse getDoanhThuTheoKhoangNgay(@RequestParam("start") String start, @RequestParam("end") String end) {
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return thongKeDoanhThuService.getDoanhThuTheoKhoangNgay(startDate, endDate);
    }
}
