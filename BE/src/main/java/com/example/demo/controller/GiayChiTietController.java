package com.example.demo.controller;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.service.GiayChiTietService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/giay-chi-tiet")
@RequiredArgsConstructor
public class GiayChiTietController {
  private final GiayChiTietService giayChiTietService;

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giayChiTietService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiayChiTietDto giayChiTietDto) {
    Pageable pageable = PageRequest.of(giayChiTietDto.getPage(), giayChiTietDto.getSize());
    return ResponseEntity.ok(
            giayChiTietService.findByPagingCriteria(giayChiTietDto, pageable));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody GiayChiTietDto giayChiTietDto) {
    return ResponseEntity.ok(giayChiTietService.add(giayChiTietDto));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody GiayChiTietDto giayChiTietDto) {
    return ResponseEntity.ok(giayChiTietService.update(giayChiTietDto));
  }

  @GetMapping("/detail/{id}")
  public ResponseEntity<?> detail(@PathVariable UUID id) {
    GiayChiTietDto giayChiTietDto = new GiayChiTietDto();
    giayChiTietDto.setId(id);
    return ResponseEntity.ok(giayChiTietService.detail(giayChiTietDto));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody GiayChiTietDto giayChiTietDto) {
    return ResponseEntity.ok(giayChiTietService.delete(giayChiTietDto));
  }
}
