package com.example.demo.controller;

import com.example.demo.dto.request.TraHangChiTietResDto;
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

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        try {
            return ResponseEntity.ok(traHangService.getAll());
        } catch (Exception e) {
            e.printStackTrace(); // In chi tiết lỗi ra log để kiểm tra
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi lấy dữ liệu!");
        }
    }

    @PostMapping("/{hoaDonId}")
    public ResponseEntity<?> traHang (@PathVariable UUID hoaDonId,
                                      @RequestBody List<TraHangChiTietResDto> traHangChiTietResDtos){
        TraHangEntity traHangEntity = traHangService.traHang(hoaDonId,traHangChiTietResDtos);
        return ResponseEntity.ok(traHangEntity);
    }
}
