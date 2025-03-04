package com.example.demo.controller;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.HoaDonChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/hoa-don-chi-tiet")
public class HoaDonChiTietController {
    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @GetMapping("/{hoaDonId}")
    public ResponseEntity<List<HoaDonChiTietEntity>> getHoaDonChiTiet(@PathVariable UUID hoaDonId) {
        Optional<HoaDonEntity> hoaDon = hoaDonRepository.findById(hoaDonId);
        if (hoaDon.isPresent()) {
            List<HoaDonChiTietEntity> danhSachChiTiet = hoaDonChiTietService.findByHoaDonGetChiTiet(hoaDon.get());
            return ResponseEntity.ok(danhSachChiTiet);
        }
        return ResponseEntity.notFound().build();
    }
}
