package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.request.GiayDto;
import com.example.demo.service.GiamGiaSanPhamService;
import com.example.demo.service.GiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/giay")
@RequiredArgsConstructor
public class GiayController {
  private final GiayService giayService;

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giayService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiayDto giayDto) {
    Pageable pageable = PageRequest.of(giayDto.getPage(), giayDto.getSize());
    return ResponseEntity.ok(
            giayService.findByPagingCriteria(giayDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.add(giayDto));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiayDto giayDto) {
    System.out.println("Received GiayDto: " + giayDto);
    return ResponseEntity.ok(giayService.update(giayDto));
  }


  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.detail(giayDto));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.delete(giayDto));
  }

  @PostMapping("/{id}/anhGiay")
  public ResponseEntity<?> anhGiay(@PathVariable("id") UUID id, @RequestBody List<UUID> anhGiayIds) {
    return ResponseEntity.ok(giayService.assignAnhGiay(id,anhGiayIds));
  }
  @GetMapping("/export-excel")
  public ResponseEntity<byte[]> exportExcel() throws IOException {
    // Lấy dữ liệu từ service và chuyển thành mảng byte
    byte[] excelFile = giayService.exportExcel().toByteArray();

    // Cấu hình header để trình duyệt tải file
    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "attachment; filename=giay.xlsx");

    // Trả về file Excel dưới dạng ResponseEntity
    return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
  }
}
