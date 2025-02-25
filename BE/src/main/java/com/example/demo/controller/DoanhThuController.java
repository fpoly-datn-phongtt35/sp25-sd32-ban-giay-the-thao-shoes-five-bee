package com.example.demo.controller;

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
    public String getDoanhThuNgayHienTai() {
        BigDecimal result = thongKeDoanhThuService.getDoanhThuNgayHienTai();
        return result != null ? "Doanh thu của bạn là: " + result.toString() : "Chưa có dữ liệu trong database";
    }

    @GetMapping("/thang-hien-tai")
    public String getDoanhThuThangHienTai() {
        BigDecimal result = thongKeDoanhThuService.getDoanhThuThangHienTai();
        return result != null ? "Doanh thu của bạn là: " + result.toString() : "Chưa có dữ liệu trong database";
    }

    @GetMapping("/nam-hien-tai")
    public String getDoanhThuNamHienTai() {
        BigDecimal result = thongKeDoanhThuService.getDoanhThuNamHienTai();
        return result != null ? "Doanh thu của bạn là: " + result.toString() : "Chưa có dữ liệu trong database";
    }

    @GetMapping("/ngay-cu-the")
    public String getDoanhThuTheoNgayCuThe(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate ngay) {
        BigDecimal result = thongKeDoanhThuService.getDoanhThuTheoNgayCuThe(ngay);
        return result != null ? "Doanh thu của bạn là: " + result.toString() : "Chưa có dữ liệu trong database";
    }

    @GetMapping("/khoang-thoi-gian")
    public String getDoanhThuTheoKhoangNgay(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) {

        startDate = startDate.trim();
        endDate = endDate.trim();

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        BigDecimal result = thongKeDoanhThuService.getDoanhThuTheoKhoangNgay(start, end);
        return result != null ? "Doanh thu của bạn là: " + result.toString() : "Chưa có dữ liệu trong database";
    }

    @GetMapping("/theo-ngay")
    public List<String> getDoanhThuTheoNgay() {
        List<String> result = thongKeDoanhThuService.getDoanhThuTheoNgay();
        return result != null && !result.isEmpty() ? result : List.of("Chưa có dữ liệu trong database");
    }
    //xong
}
