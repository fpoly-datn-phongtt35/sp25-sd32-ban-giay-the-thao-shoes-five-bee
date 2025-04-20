package com.example.demo.controller;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.dto.request.ThongTinNguoiNhanDto;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.TrangThaiHoaDonService;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trang-thai-hoa-don")
public class HoaDonController {
  @Autowired private TrangThaiHoaDonService trangThaiHoaDonService;
  @Autowired private HoaDonRepository hoaDonRepository;

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PutMapping("/xac-nhan/{id}")
  public HoaDonEntity xacNhanHoaDon(@PathVariable UUID id) {
    return trangThaiHoaDonService.xacNhanHoaDon(id);
  }

  // 0 cho xac nhan
  // 1 hoa don cho thanh toan
  // 2 hoan thanh
  // 3 da xac nhan
  // 4 cho van chuyen
  // 5 dang van chuyen
  // 6 da giao hang
  // 7 tra hang
  // 8 da huy
  // 9 cho nhap hang

  /** API hủy hóa đơn */
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @PutMapping("/{id}/huy")
  public HoaDonEntity huyHoaDon(@PathVariable UUID id) {
    return trangThaiHoaDonService.huyHoaDon(id);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/getAll")
  public List<HoaDonDto> getAllHoaDon() {
    return trangThaiHoaDonService.getAllHoaDon();
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/{id}")
  public ResponseEntity<HoaDonEntity> getHoaDonChiTiet(@PathVariable UUID id) {
    HoaDonEntity hoaDon = trangThaiHoaDonService.findById(id);
    return ResponseEntity.ok(hoaDon);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/download-pdf/{id}")
  public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable UUID id) {
    byte[] pdfData = trangThaiHoaDonService.printHoaDon(id);
    if (pdfData != null) {
      HttpHeaders httpHeaders = new HttpHeaders();
      httpHeaders.add("Content-Disposition", "inline; filename=invoice_" + id + ".pdf");
      return new ResponseEntity<>(pdfData, httpHeaders, HttpStatus.OK);
    } else {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
    @PutMapping("/hoa-don/{id}/cap-nhat-thong-tin-nguoi-nhan")
    public ResponseEntity<?> capNhatNguoiNhan(@PathVariable UUID id, @RequestBody ThongTinNguoiNhanDto dto){
            HoaDonEntity hoaDon = hoaDonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

            if (hoaDon.getTrangThai() != 0) {
                return ResponseEntity.badRequest().body("Chỉ được cập nhật khi hóa đơn ở trạng thái chờ xác nhận.");
            }

            hoaDon.setTenNguoiNhanMoi(dto.getTenNguoiNhanMoi());
            hoaDon.setSdtNguoiNhanMoi(dto.getSdtNguoiNhanMoi());

            hoaDonRepository.save(hoaDon);
            return ResponseEntity.ok("Cập nhật thông tin người nhận thành công.");
        }
}
