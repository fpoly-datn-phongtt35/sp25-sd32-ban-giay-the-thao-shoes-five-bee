package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.request.GiayDto;
import com.example.demo.dto.request.GiayRequest;
import com.example.demo.entity.GiayEntity;
import com.example.demo.service.GiamGiaSanPhamService;
import com.example.demo.service.GiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/giay")
@RequiredArgsConstructor
public class GiayController {
  private final GiayService giayService;

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giayService.getAll());
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiayDto giayDto) {
    Pageable pageable = PageRequest.of(giayDto.getPage(), giayDto.getSize());
    return ResponseEntity.ok(
            giayService.findByPagingCriteria(giayDto, pageable));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/add-bien-the")
  public ResponseEntity<?> addBienThe(@RequestBody GiayRequest giayRequest) {
    return ResponseEntity.ok(giayService.addGiayAndGiayChiTiet(giayRequest));
    }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.add(giayDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiayDto giayDto) {
    System.out.println("Received GiayDto: " + giayDto);
    return ResponseEntity.ok(giayService.update(giayDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.detail(giayDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiayDto giayDto) {
    return ResponseEntity.ok(giayService.delete(giayDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/{id}/anhGiay")
  public ResponseEntity<?> anhGiay(@PathVariable("id") UUID id, @RequestBody List<UUID> anhGiayIds) {
    return ResponseEntity.ok(giayService.assignAnhGiay(id,anhGiayIds));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/export-excel")
  public ResponseEntity<byte[]> exportExcel() throws IOException {
    byte[] excelFile = giayService.exportExcel().toByteArray();
    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "attachment; filename=giay.xlsx");
    return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
  @GetMapping("/search-ten")
  public ResponseEntity<?> searchGiayByName(@RequestParam String ten) {
    if (ten == null || ten.trim().isEmpty()) {
      return ResponseEntity.badRequest().body("Tên không được để trống.");
    }

    List<GiayEntity> result = giayService.findByTen(ten);

    if (result.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy kết quả phù hợp.");
    }

    return ResponseEntity.ok(result);
  }

}
