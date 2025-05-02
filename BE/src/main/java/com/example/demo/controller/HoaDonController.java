package com.example.demo.controller;

import com.example.demo.dto.request.HoaDonDto;
import com.example.demo.dto.request.ThongTinNguoiNhanDto;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.repository.GiayRepository;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.repository.HoaDonRepository;
import com.example.demo.service.TrangThaiHoaDonService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.demo.service.impl.TrangThaiHoaDonServiceImpl;
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
  @Autowired private TrangThaiHoaDonServiceImpl trangThaiHoaDonServiceImpl;
  @Autowired
  private HoaDonChiTietRepository hoaDonChiTietRepository;
  @Autowired
  private GiayChiTietRepository giayChiTietRepository;
  @Autowired
  private GiayRepository giayRepository;

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PutMapping("/xac-nhan/{id}")
  public HoaDonEntity xacNhanHoaDon(@PathVariable UUID id){
    return trangThaiHoaDonService.xacNhanHoaDon(id);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @GetMapping("/check-cho-nhap-hang")
  public ResponseEntity<String> checkChoNhapHang(
  @RequestParam("action")String action,
  @RequestParam("orderId")String orderId) {
    boolean isChoNhapHang = "wait".equals(action);
    trangThaiHoaDonServiceImpl.handleUserResponse(orderId, isChoNhapHang);
    return ResponseEntity.ok("Cảm ơn bạn đã phản hồi đơn hàng.");
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @GetMapping("/continue-order")
  public ResponseEntity<?> xuLyTiepTucDonHang(
          @RequestParam("action") String action,
          @RequestParam("orderId") String orderId
  ){
    HoaDonEntity hoaDonEntity = hoaDonRepository.findByMa(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy mã hóa đơn"));

    if ("continue".equalsIgnoreCase(action) && hoaDonEntity.getTrangThai() == 9){
      List<HoaDonChiTietEntity> hoaDonChiTietEntities = hoaDonChiTietRepository.findByHoaDon(hoaDonEntity);
      for (HoaDonChiTietEntity ct : hoaDonChiTietEntities) {
        GiayChiTietEntity chiTiet = ct.getGiayChiTietEntity();
        int soLuongMua = ct.getSoLuong();

        if (chiTiet.getSoLuongTon() < soLuongMua) {
          return ResponseEntity.badRequest().body("Không đủ tồn kho cho sản phẩm: " + chiTiet.getId());
        }

        // Trừ số lượng tồn
        chiTiet.setSoLuongTon(chiTiet.getSoLuongTon() - soLuongMua);
        giayChiTietRepository.save(chiTiet);
      }


      Set<UUID> giayIds = hoaDonChiTietEntities.stream()
              .map(ct -> ct.getGiayChiTietEntity().getGiayEntity().getId())
              .collect(Collectors.toSet());

      for (UUID giayId : giayIds) {
        List<GiayChiTietEntity> bienThes = giayChiTietRepository.findByGiayEntityId(giayId);
        int tongTon = bienThes.stream().mapToInt(GiayChiTietEntity::getSoLuongTon).sum();

        GiayEntity giay = bienThes.get(0).getGiayEntity();
        giay.setSoLuongTon(tongTon);
        giayRepository.save(giay);
      }
      hoaDonEntity.setTrangThai(4);
      hoaDonRepository.save(hoaDonEntity);
      return ResponseEntity.ok("Đơn hàng đã chuyển sang trạng thái chờ vận chuyển");
    }
    if ("cancel".equalsIgnoreCase(action) && hoaDonEntity.getTrangThai() == 9) {
      hoaDonEntity.setTrangThai(8); // trạng thái HỦY
      hoaDonRepository.save(hoaDonEntity);
      return ResponseEntity.ok("Đơn hàng đã được hủy");
    }
    return ResponseEntity.badRequest().body("Thao tác không hợp lệ hoặc trạng thái không phù hợp");
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
