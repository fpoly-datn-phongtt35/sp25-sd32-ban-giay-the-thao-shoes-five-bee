package com.example.demo.controller;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.request.GiamGiaHoaDonChiTietDto;
import com.example.demo.service.GiamGiaHoaDonChiTietService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/giam-gia-hd-ct")
@RequiredArgsConstructor
public class GiamGiaHoaDonChiTietController {
  private final GiamGiaHoaDonChiTietService giamGiaHoaDonChiTietService;

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaHoaDonChiTietService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(
      @RequestBody GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    Pageable pageable =
        PageRequest.of(giamGiaHoaDonChiTietDto.getPage(), giamGiaHoaDonChiTietDto.getSize());
    return ResponseEntity.ok(
        giamGiaHoaDonChiTietService.findByPagingCriteria(giamGiaHoaDonChiTietDto, pageable));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    return ResponseEntity.ok(giamGiaHoaDonChiTietService.add(giamGiaHoaDonChiTietDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    return ResponseEntity.ok(giamGiaHoaDonChiTietService.update(giamGiaHoaDonChiTietDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    return ResponseEntity.ok(giamGiaHoaDonChiTietService.detail(giamGiaHoaDonChiTietDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto) {
    return ResponseEntity.ok(giamGiaHoaDonChiTietService.delete(giamGiaHoaDonChiTietDto));
  }
}
