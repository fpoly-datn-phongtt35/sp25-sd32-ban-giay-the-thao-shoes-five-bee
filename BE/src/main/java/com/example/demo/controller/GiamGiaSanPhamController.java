package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamRequest;
import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.entity.GiamGiaSanPhamEntity;
import com.example.demo.entity.GiayEntity;
import com.example.demo.service.GiamGiaSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/giam-gia-san-pham")
@RequiredArgsConstructor
public class GiamGiaSanPhamController {
  private final GiamGiaSanPhamService giamGiaSanPhamService;

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/tao-giam-gia")
  public ResponseEntity<?> taoChuongTrinhGiamGia(@RequestBody GiamGiaChiTietSanPhamRequest request) {
    return ResponseEntity.ok(giamGiaSanPhamService.taoChuongTrinhGiamGia(request));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/giay-chi-tiet")
  public ResponseEntity<?> taoChuongTrinhGiamGia(@RequestParam UUID id) {
    return ResponseEntity.ok(giamGiaSanPhamService.getGiayChiTietByGiamGia(id));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaSanPhamService.getAll());
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Pageable pageable = PageRequest.of(giamGiaSanPhamDto.getPage(), giamGiaSanPhamDto.getSize());
    return ResponseEntity.ok(
        giamGiaSanPhamService.findByPagingCriteria(giamGiaSanPhamDto, pageable));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.add(giamGiaSanPhamDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/update/{id}")
  public ResponseEntity<?> update(@PathVariable("id") UUID id, @RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    // Bạn có thể sử dụng id để xác định đợt giảm giá cần cập nhật
    giamGiaSanPhamDto.setId(id);
    return ResponseEntity.ok(giamGiaSanPhamService.update(giamGiaSanPhamDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/detail/{id}")
  public ResponseEntity<?> detail(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(giamGiaSanPhamService.detail(id));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.delete(giamGiaSanPhamDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/export-excel")
  public ResponseEntity<byte[]> exportExcel() throws IOException {
    byte[] excelFile = giamGiaSanPhamService.exportExcel().toByteArray();
    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "attachment; filename=chuongtrinhgiamgia.xlsx");
    return ResponseEntity.ok().headers(headers).body(excelFile);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/search-ten")
  public ResponseEntity<List<GiamGiaSanPhamEntity>> searchGiamGiaByName(@RequestParam String ten) {
    List<GiamGiaSanPhamEntity> result = giamGiaSanPhamService.findByTen(ten);
    return ResponseEntity.ok(result);
  }
}
