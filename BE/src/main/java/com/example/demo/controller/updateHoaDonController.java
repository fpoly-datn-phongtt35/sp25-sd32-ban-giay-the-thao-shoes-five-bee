package com.example.demo.controller;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.service.UpdateHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/sua-hoa-don-cho")
public class updateHoaDonController {
    @Autowired
    private UpdateHoaDonService updateHoaDonService;

    /**
     * 📌 1. API Cập nhật địa chỉ hóa đơn
     */
    @PutMapping("/sua-dia-chi/{hoaDonId}")
    public ResponseEntity<HoaDonEntity> updateAddress(
            @PathVariable UUID hoaDonId,
            @RequestParam String tenNguoiNhan,
            @RequestParam String sdtNguoiNhan,
            @RequestParam String xa,
            @RequestParam String huyen,
            @RequestParam String tinh,
            @RequestParam String diaChi) {

        HoaDonEntity updatedHoaDon = updateHoaDonService.updateHoaDonAddress(hoaDonId, tenNguoiNhan, sdtNguoiNhan, xa, huyen, tinh, diaChi);
        return ResponseEntity.ok(updatedHoaDon);
    }

    /**
     * 📌 2. API Cập nhật số lượng sản phẩm trong hóa đơn
     */
    @PutMapping("/them-so-luong/{hoaDonChiTietId}")
    public ResponseEntity<HoaDonChiTietEntity> updateQuantity(
            @PathVariable UUID hoaDonChiTietId,
            @RequestParam boolean isIncrease) {

        HoaDonChiTietEntity updatedChiTiet = updateHoaDonService.updateSoLuongSanPham(hoaDonChiTietId, isIncrease);
        return ResponseEntity.ok(updatedChiTiet);
    }

    /**
     * 📌 3. API Thêm sản phẩm vào hóa đơn
     */
    @PostMapping("/them-san-pham/{hoaDonId}")
    public ResponseEntity<HoaDonChiTietEntity> addProductToHoaDon(
            @PathVariable UUID hoaDonId,
            @RequestParam UUID giayChiTietId) {

        // Gọi service mà không cần truyền số lượng, vì service đã mặc định là 1
        HoaDonChiTietEntity newChiTiet = updateHoaDonService.themSanPhamVaoHoaDon(hoaDonId, giayChiTietId);

        return ResponseEntity.ok(newChiTiet);
    }


    /**
     * 📌 4. API Xóa sản phẩm khỏi hóa đơn
     */
    @DeleteMapping("/remove-product/{hoaDonChiTietId}")
    public ResponseEntity<String> removeProductFromHoaDon(@PathVariable UUID hoaDonChiTietId) {
        updateHoaDonService.removeSanPhamKhoiHoaDon(hoaDonChiTietId);
        return ResponseEntity.ok("Sản phẩm đã được xóa khỏi hóa đơn.");
    }
}
