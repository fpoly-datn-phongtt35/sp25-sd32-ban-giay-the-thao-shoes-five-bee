package com.example.demo.controller;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.service.BanHangTaiQuayService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import com.example.demo.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/ban-hang-tai-quay")
@RequiredArgsConstructor
public class BanHangTaiQuayController {

  private final BanHangTaiQuayService banHangTaiQuayService;
  private final QRCodeService qrCodeService;

  @PostMapping("/thanh-toan/{idHoaDon}")
  public ResponseEntity<?> thanhToanTaiQuay(
      @PathVariable("idHoaDon") UUID idHoaDon, @RequestBody HoaDonRequest hoaDonRequest) {
    banHangTaiQuayService.thanhToanTaiQuay(idHoaDon, hoaDonRequest);
    return ResponseEntity.ok("Thanh toán thành công");
  }

  @PostMapping("/create")
  public ResponseEntity<?> createHoaDonBanHangTaiQuay() {
    return ResponseEntity.ok(banHangTaiQuayService.createHoaDonBanHangTaiQuay());
  }

  @PostMapping("/add-product/{idHoaDon}")
  public ResponseEntity<?> themSanPhamVaoHoaDon(
      @PathVariable("idHoaDon") UUID idHoaDon, @RequestParam UUID idSanPham) {
    return ResponseEntity.ok(banHangTaiQuayService.themSanPhamVaoHoaDon(idHoaDon, idSanPham));
  }

  @PutMapping("/update-quantity/{idHoaDonChiTiet}")
  public ResponseEntity<?> updateSoLuongGiay(
      @PathVariable("idHoaDonChiTiet") UUID idHoaDonChiTiet, @RequestParam boolean isIncrease) {

    return ResponseEntity.ok(banHangTaiQuayService.updateSoLuongGiay(idHoaDonChiTiet, isIncrease));
  }

  @GetMapping("/list")
  public ResponseEntity<?> getListHoaDonCho() {
    return ResponseEntity.ok(banHangTaiQuayService.getListHoaDonCho());
  }

  @DeleteMapping("/delete/{idHoaDon}")
  public ResponseEntity<?> deleteHoaDonCho(@PathVariable("idHoaDon") UUID idHoaDon) {
    banHangTaiQuayService.deleteHoaDonCho(idHoaDon);
    return ResponseEntity.ok("Xóa hóa đơn thành công");
  }

  @DeleteMapping("/delete-all")
  public ResponseEntity<?> deleteAllHoaDonCho(@RequestBody List<UUID> idHoaDons) {
    banHangTaiQuayService.deleteAllHoaDonCho(idHoaDons);
    return ResponseEntity.ok("Xóa tất cả hóa đơn thành công");
  }

  @DeleteMapping("/delete-detail/{idHoaDonChiTiet}")
  public ResponseEntity<?> deleteHoaDonChiTiet(@PathVariable("idHoaDonChiTiet") UUID idHoaDonChiTiet) {
    banHangTaiQuayService.deleteHoaDonChiTiet(idHoaDonChiTiet);
    return ResponseEntity.ok("Xóa hóa đơn chi tiết thành công");
  }
  @GetMapping("/scan-webcam")
  public ResponseEntity<?> scanQRCodeFromWebcam() {
    String result = qrCodeService.scanAndAddToHoaDonChoFromWebcam();
    return ResponseEntity.ok(result);
  }//quet cam
  @PostMapping("/scan-qr")
  public ResponseEntity<String> scanQRCodeFromFile(@RequestParam("file") MultipartFile file) throws IOException {
    String result = qrCodeService.scanAndAddToHoaDonCho(file);
    return ResponseEntity.ok(result);
  }//test postman up file anh QR
}
