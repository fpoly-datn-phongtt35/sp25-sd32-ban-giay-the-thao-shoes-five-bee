package com.example.demo.controller;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.service.BanHangTaiQuayService;
import com.example.demo.service.QRCodeService;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
      @PathVariable("idHoaDon") UUID idHoaDon,
      @RequestParam(required = false) UUID idGiamGia,
      @RequestParam Integer hinhThucThanhToan,
      @RequestParam Boolean isGiaoHang,
      @RequestBody HoaDonRequest hoaDonRequest) {
    banHangTaiQuayService.thanhToanTaiQuay(
        idHoaDon, idGiamGia, hinhThucThanhToan, isGiaoHang, hoaDonRequest);
    return ResponseEntity.ok("Thanh toán thành công");
  }

  @GetMapping("/san-pham/{idHoaDon}")
  public ResponseEntity<?> getSanPhamTrongHoaDonCho(@PathVariable UUID idHoaDon) {
    return ResponseEntity.ok(banHangTaiQuayService.getSanPhamTrongHoaDon(idHoaDon));
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
          @PathVariable("idHoaDonChiTiet") UUID idHoaDonChiTiet,
          @RequestParam boolean isIncrease
  ) {
    try {
      HoaDonChiTietEntity updated = banHangTaiQuayService.updateSoLuongGiay(idHoaDonChiTiet, isIncrease);
      return ResponseEntity.ok(updated);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("⚠️ Lỗi: " + e.getMessage());
    } catch (IllegalStateException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ Lỗi: " + e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Lỗi hệ thống: " + e.getMessage());
    }
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
  public ResponseEntity<?> deleteHoaDonChiTiet(
      @PathVariable("idHoaDonChiTiet") UUID idHoaDonChiTiet) {
    banHangTaiQuayService.deleteHoaDonChiTiet(idHoaDonChiTiet);
    return ResponseEntity.ok("Xóa hóa đơn chi tiết thành công");
  }

  @GetMapping("/scan-webcam")
  public ResponseEntity<?> scanQRCodeFromWebcam() {
    String result = qrCodeService.scanAndAddToHoaDonChoFromWebcam();
    return ResponseEntity.ok(result);
  } // quet cam

  @PostMapping("/scan-qr")
  public ResponseEntity<String> scanQRCodeFromFile(@RequestParam("file") MultipartFile file)
      throws IOException {
    String result = qrCodeService.scanAndAddToHoaDonCho(file);
    return ResponseEntity.ok(result);
  } // test postman up file anh QR
}
