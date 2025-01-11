package com.example.demo.controller;

import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.request.GiayDto;
import com.example.demo.service.GiamGiaSanPhamService;
import com.example.demo.service.GiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
