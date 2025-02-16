package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamRequest;
import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.service.GiamGiaSanPhamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/giam-gia-san-pham")
@RequiredArgsConstructor
public class GiamGiaSanPhamController {
  private final GiamGiaSanPhamService giamGiaSanPhamService;

  @PostMapping("/tao-giam-gia")
  public ResponseEntity<?> taoChuongTrinhGiamGia(@RequestBody GiamGiaChiTietSanPhamRequest request) {
    return ResponseEntity.ok(giamGiaSanPhamService.taoChuongTrinhGiamGia(request));
  }

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaSanPhamService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    Pageable pageable = PageRequest.of(giamGiaSanPhamDto.getPage(), giamGiaSanPhamDto.getSize());
    return ResponseEntity.ok(
        giamGiaSanPhamService.findByPagingCriteria(giamGiaSanPhamDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.add(giamGiaSanPhamDto));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.update(giamGiaSanPhamDto));
  }

  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.detail(giamGiaSanPhamDto));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaSanPhamDto giamGiaSanPhamDto) {
    return ResponseEntity.ok(giamGiaSanPhamService.delete(giamGiaSanPhamDto));
  }
}
