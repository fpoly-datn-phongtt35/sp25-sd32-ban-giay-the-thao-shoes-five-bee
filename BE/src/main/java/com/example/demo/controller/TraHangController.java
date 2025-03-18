package com.example.demo.controller;

import com.example.demo.dto.request.TraHangChiTietResDto;
import com.example.demo.dto.request.XemTraHangDto;
import com.example.demo.entity.TraHangChiTietEntity;
import com.example.demo.entity.TraHangEntity;
import com.example.demo.service.TraHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tra-hang")
public class TraHangController {
    @Autowired
    private TraHangService traHangService;


    @GetMapping("/xem-tra-hang/{hoaDonId}")
    public ResponseEntity<List<XemTraHangDto>> getProductsReturned(@PathVariable UUID hoaDonId) {
        try {
            List<XemTraHangDto> productsReturned = traHangService.getProductsReturned(hoaDonId);
            return ResponseEntity.ok(productsReturned);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }
    @PostMapping("/create/{hoaDonId}")
    public ResponseEntity<TraHangEntity> createTraHang(@PathVariable UUID hoaDonId, @RequestBody List<TraHangChiTietResDto> traHangChiTietResDtos) {
        TraHangEntity traHangEntity = traHangService.createTraHang(hoaDonId, traHangChiTietResDtos);
        return ResponseEntity.ok(traHangEntity);
    }

    // Endpoint hủy trả hàng
    @PostMapping("/cancel/{traHangId}")
    public ResponseEntity<String> cancelTraHang(@PathVariable UUID traHangId) {
        try {
            traHangService.cancelTraHang(traHangId);
            return ResponseEntity.ok("Trả hàng đã bị hủy.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }

    // Endpoint xác nhận trả hàng
    @PostMapping("/confirm/{traHangId}")
    public ResponseEntity<String> confirmTraHang(@PathVariable UUID traHangId) {
        try {
            traHangService.confirmTraHang(traHangId);
            return ResponseEntity.ok("Trả hàng đã được xác nhận.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        }
    }
}
