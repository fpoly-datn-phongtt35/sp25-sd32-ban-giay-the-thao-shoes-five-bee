package com.example.demo.controller;

import com.example.demo.dto.request.LichSuHoaDonDto;
import com.example.demo.service.LichSuHoaDonService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lich-su-hoa-don")
@RequiredArgsConstructor
public class LichSuHoaDonController {

  private final LichSuHoaDonService lichSuHoaDonService;

  @GetMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(lichSuHoaDonService.getAll());
  }

  @GetMapping("/search")
  public ResponseEntity<?> findAndPageLichSuHoaDon(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    Pageable pageable = PageRequest.of(lichSuHoaDonDto.getPage(), lichSuHoaDonDto.getSize());
    return ResponseEntity.ok(lichSuHoaDonService.findByPagingCriteria(lichSuHoaDonDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    return ResponseEntity.ok(lichSuHoaDonService.add(lichSuHoaDonDto));
  }

  @PutMapping("/update")
  public ResponseEntity<?> update(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    return ResponseEntity.ok(lichSuHoaDonService.update(lichSuHoaDonDto));
  }

  @GetMapping("/detail/{id}")
  public ResponseEntity<?> detail(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(lichSuHoaDonService.detail(id));
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> delete(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(lichSuHoaDonService.delete(id));
  }

  @GetMapping("/hoa-don")
  public ResponseEntity<?> getLichSuHoaDonByHoaDonId(@RequestParam UUID hoaDonId) {
    return ResponseEntity.ok(lichSuHoaDonService.getListLichSuHoaDonByHoaDonId(hoaDonId));
  }
}
