package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.service.GiamGiaHoaDonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/giam-gia-hoa-don")
@RequiredArgsConstructor
public class GiamGiaHoaDonController {
  private final GiamGiaHoaDonService giamGiaHoaDonService;

  @PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('STAFF')" )
  @GetMapping("/giam-gia")
  public ResponseEntity<?> getGiamGiaByMa(@RequestParam(required = false) String ma) {
    return ResponseEntity.ok(giamGiaHoaDonService.getGiamGia(ma));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giamGiaHoaDonService.getAll());
  }

  @PreAuthorize("hasRole('ADMIN') " )
  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    Pageable pageable = PageRequest.of(giamGiaHoaDonDto.getPage(), giamGiaHoaDonDto.getSize());
    return ResponseEntity.ok(giamGiaHoaDonService.findByPagingCriteria(giamGiaHoaDonDto, pageable));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.add(giamGiaHoaDonDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.update(giamGiaHoaDonDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.detail(giamGiaHoaDonDto));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiamGiaHoaDonDto giamGiaHoaDonDto) {
    return ResponseEntity.ok(giamGiaHoaDonService.delete(giamGiaHoaDonDto));
  }
}
