package com.example.demo.controller;

import com.example.demo.dto.request.BanHangOnlineRequest;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.service.BanHangService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.example.demo.service.TrangThaiHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/online")
@RequiredArgsConstructor
public class BanHangOnlineController {

  private final BanHangService banHangService;

  private final TrangThaiHoaDonService trangThaiHoaDonService;

  @PostMapping("/thanh-toan")
  public ResponseEntity<?> banHangOnline(@RequestBody BanHangOnlineRequest banHangOnlineRequest) {
    HoaDonEntity hoaDon = banHangService.banHangOnline(banHangOnlineRequest.getIdGiamGia(), banHangOnlineRequest.getHinhThucThanhToan(), banHangOnlineRequest);
    return ResponseEntity.ok(Map.of("idHoaDon", hoaDon.getId(), "tongTien", hoaDon.getTongTien()));
  }


  @GetMapping("/user/{userId}")
  public ResponseEntity<List<HoaDonEntity>> getHoaDonByUserId(@PathVariable UUID userId){
    List<HoaDonEntity> hoaDonEntities = trangThaiHoaDonService.getHoaDonByUserId(userId);
    return new ResponseEntity<>(hoaDonEntities, HttpStatus.OK);
  }
}
