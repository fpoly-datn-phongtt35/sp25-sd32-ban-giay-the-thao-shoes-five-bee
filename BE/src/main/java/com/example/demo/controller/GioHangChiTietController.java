package com.example.demo.controller;

import com.example.demo.service.GioHangChiTietService;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gio-hang-chi-tiet")
public class GioHangChiTietController {

  @Autowired private GioHangChiTietService gioHangChiTietService;

  @GetMapping("/check-out")
  public ResponseEntity<?> getGioHangChiTietKhiCheckout(@RequestBody List<UUID> ids) {
    return ResponseEntity.ok(gioHangChiTietService.getGioHangChiTietKhiCheckout(ids));
  }

  @PostMapping("/add-to-cart")
  public ResponseEntity<String> addToCart(
      @RequestParam UUID idGiayChiTiet, @RequestParam int soLuong) {
    gioHangChiTietService.addToCart(idGiayChiTiet, soLuong);
    return ResponseEntity.ok("Thêm sản phẩm vào giỏ hàng thành công");
  }

  @PutMapping("/update-so-luong")
  public ResponseEntity<?> addToCart(
      @RequestParam UUID idGioHangChiTiet, @RequestParam boolean isIncrease) {

    return ResponseEntity.ok(gioHangChiTietService.updateSoLuongGiay(idGioHangChiTiet, isIncrease));
  }

  @DeleteMapping("/delete-giay")
  public ResponseEntity<?> deleteAllHoaDonCho(@RequestParam UUID idGioHangChiTiet) {
    gioHangChiTietService.deleteSanPhamTrongGioHang(idGioHangChiTiet);
    return ResponseEntity.ok("Xóa giày thành công");
  }
}
