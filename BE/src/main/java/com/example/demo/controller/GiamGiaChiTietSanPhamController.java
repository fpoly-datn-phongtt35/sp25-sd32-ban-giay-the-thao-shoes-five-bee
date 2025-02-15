package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamDto;
import com.example.demo.service.GiamGiaChiTietSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/giam-gia-ct-sp")
@RequiredArgsConstructor
public class GiamGiaChiTietSanPhamController {
  private final GiamGiaChiTietSanPhamService giamGiaChiTietSanPhamService;

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaChiTietSanPhamService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(
      @RequestBody GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    Pageable pageable =
        PageRequest.of(giamGiaChiTietSanPhamDto.getPage(), giamGiaChiTietSanPhamDto.getSize());
    return ResponseEntity.ok(
        giamGiaChiTietSanPhamService.findByPagingCriteria(giamGiaChiTietSanPhamDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return ResponseEntity.ok(giamGiaChiTietSanPhamService.add(giamGiaChiTietSanPhamDto));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return ResponseEntity.ok(giamGiaChiTietSanPhamService.update(giamGiaChiTietSanPhamDto));
  }

  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return ResponseEntity.ok(giamGiaChiTietSanPhamService.detail(giamGiaChiTietSanPhamDto));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto) {
    return ResponseEntity.ok(giamGiaChiTietSanPhamService.delete(giamGiaChiTietSanPhamDto));
  }
}
