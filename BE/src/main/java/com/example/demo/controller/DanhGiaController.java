package com.example.demo.controller;

import com.example.demo.dto.request.DanhGiaDto;
import com.example.demo.entity.DanhGiaEntity;
import com.example.demo.service.DanhGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/danh-gia")
public class DanhGiaController {
    @Autowired
    private DanhGiaService danhGiaService;

    @PreAuthorize("hasRole('USER')" )
    @PostMapping("/add")
    public ResponseEntity<?> createDanhGia(@RequestBody DanhGiaDto danhGiaDto){
        danhGiaService.creteDanhGia(danhGiaDto);
        return ResponseEntity.ok(Map.of("message","Đánh giá thành công"));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @GetMapping
    public ResponseEntity<List<DanhGiaDto>> getDanhGiaByUserAndHoaDonChiTiet(
            @RequestParam UUID userId,
            @RequestParam UUID hoaDonChiTietId
    ){
        List<DanhGiaDto> danhGiaDtos = danhGiaService.getDanhGiaByUserAndHoaDonChiTiet(userId,hoaDonChiTietId);
        return ResponseEntity.ok(danhGiaDtos);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @GetMapping("/{hoaDonChiTietId}")
    public ResponseEntity<List<DanhGiaDto>> getDanhGia(@PathVariable UUID hoaDonChiTietId){
        return ResponseEntity.ok(danhGiaService.getDanhGiaByHoaDonChiTiet(hoaDonChiTietId));
    }

    @PreAuthorize("hasRole('USER')" )
    @GetMapping("/san-pham/{giayId}")
    public ResponseEntity<List<DanhGiaDto>> getDanhGiaByGiayId(@PathVariable UUID giayId) {
        List<DanhGiaDto> danhGiaList = danhGiaService.getDanhGiaByProduct(giayId);
        return ResponseEntity.ok(danhGiaList);
    }
}
