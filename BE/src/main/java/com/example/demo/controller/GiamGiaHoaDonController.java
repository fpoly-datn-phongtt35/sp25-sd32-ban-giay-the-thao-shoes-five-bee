package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.service.GiamGiaHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/giam-gia-hoa-don")
@RequiredArgsConstructor
public class GiamGiaHoaDonController {
  private final GiamGiaHoaDonService giamGiaHoaDonService;

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaHoaDonService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    Pageable pageable = PageRequest.of(giamGiaHoaDonDto.getPage(), giamGiaHoaDonDto.getSize());
    return ResponseEntity.ok(
            giamGiaHoaDonService.findByPagingCriteria(giamGiaHoaDonDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.add(giamGiaHoaDonDto));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.update(giamGiaHoaDonDto));
  }

  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.detail(giamGiaHoaDonDto));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.delete(giamGiaHoaDonDto));
  }
}
