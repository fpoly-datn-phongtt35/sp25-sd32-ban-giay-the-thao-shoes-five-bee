package com.example.demo.controller;

import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.BanHangTaiQuayService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ban-hang-tai-quay")
@RequiredArgsConstructor
public class BanHangTaiQuayController {

  private final BanHangTaiQuayService banHangTaiQuayService;
  @Autowired
  private HoaDonRepository hoaDonRepository;

  @PostMapping("/thanh-toan/{idHoaDon}")
  public ResponseEntity<String> thanhToan(@PathVariable UUID idHoaDon, @RequestBody HoaDonRequest hoaDonRequest) {

    banHangTaiQuayService.thanhToanTaiQuay(idHoaDon, hoaDonRequest);

    HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon)
            .orElseThrow(() -> new IllegalArgumentException("Hóa đơn không tồn tại"));

    BigDecimal soTienKhachDua = hoaDonRequest.getSoTienKhachDua();
    BigDecimal tienThua = soTienKhachDua.subtract(hoaDon.getTongTien());

    return ResponseEntity.ok("Thanh toán thành công! Tiền thừa của khách là: " + tienThua + " VND");
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
}
