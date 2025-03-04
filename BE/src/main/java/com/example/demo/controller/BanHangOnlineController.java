package com.example.demo.controller;

import com.example.demo.dto.request.BanHangOnlineRequest;
import com.example.demo.service.BanHangService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/online")
@RequiredArgsConstructor
public class BanHangOnlineController {

  private final BanHangService banHangService;

  @PostMapping("/thanh-toan")
  public ResponseEntity<?> banHangOnline(
      @RequestParam(required = false) UUID idGiamGia,
      @RequestParam Integer hinhThucThanhToan,
      @RequestBody BanHangOnlineRequest banHangOnlineRequest) {
    return ResponseEntity.ok(
        banHangService.banHangOnline(idGiamGia, hinhThucThanhToan, banHangOnlineRequest));
  }
}
