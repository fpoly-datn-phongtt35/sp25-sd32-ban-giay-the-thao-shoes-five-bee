package com.example.demo.controller;

import com.example.demo.dto.response.DoanhThuResponse;
import com.example.demo.service.ThongKeDoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/nam-cu-the")
    public DoanhThuResponse getDoanhThuNamCuThe(@RequestParam("year") int year) {
        return thongKeDoanhThuService.getDoanhThuNamCuThe(year);
    }

    // Endpoint cho doanh thu theo tháng cụ thể
    @GetMapping("/thang-cu-the")
    public DoanhThuResponse getDoanhThuThangCuThe(@RequestParam("year") int year, @RequestParam("month") int month) {
        return thongKeDoanhThuService.getDoanhThuThangCuThe(year, month);
    }
}
