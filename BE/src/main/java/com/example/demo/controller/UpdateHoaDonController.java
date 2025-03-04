package com.example.demo.controller;

import com.example.demo.entity.HoaDonEntity;
import com.example.demo.service.TrangThaiHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trang-thai-hoa-don")
public class UpdateHoaDonController {
    @Autowired
    private TrangThaiHoaDonService trangThaiHoaDonService;
    @PutMapping("/xac-nhan/{id}")
    public HoaDonEntity xacNhanHoaDon(@PathVariable UUID id) {
        return trangThaiHoaDonService.xacNhanHoaDon(id);
    }

    /**
     * API hủy hóa đơn
     */
    @PutMapping("/{id}/huy")
    public HoaDonEntity huyHoaDon(@PathVariable UUID id) {
        return trangThaiHoaDonService.huyHoaDon(id);
    }
    @GetMapping
    public List<HoaDonEntity> getAllHoaDon() {
        return trangThaiHoaDonService.getAllHoaDon();
    }
}
