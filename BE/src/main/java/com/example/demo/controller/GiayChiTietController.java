package com.example.demo.controller;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.service.GiayChiTietService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.example.demo.service.GiayService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/giay-chi-tiet")
@RequiredArgsConstructor
public class GiayChiTietController {
  private final GiayChiTietService giayChiTietService;

  @GetMapping("/goi-y/{giayId}")
  public ResponseEntity<?> getSanPhamTuongTu(@PathVariable UUID giayId) {
    List<GiayChiTietEntity> goiYList = giayChiTietService.goiYSanPhamTuongTuTheoGiayId(giayId);
    return ResponseEntity.ok(goiYList);
  }

  @PutMapping("/update-bien-the/{id}")
  public ResponseEntity<?> updateBienThe(
      @PathVariable UUID id, @RequestParam Integer soLuong, @RequestParam BigDecimal giaBan) {
    return ResponseEntity.ok(giayChiTietService.updateSoLuongVaGaiaBan(id, soLuong, giaBan));
  }

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(giayChiTietService.getAll());
  }

  @PostMapping("/search")
  public ResponseEntity<?> findAndPageChatLieu(@RequestBody GiayChiTietDto giayChiTietDto) {
    Pageable pageable = PageRequest.of(giayChiTietDto.getPage(), giayChiTietDto.getSize());
    return ResponseEntity.ok(giayChiTietService.findByPagingCriteria(giayChiTietDto, pageable));
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

  @PostMapping("/{id}/anhGiayChiTiet")
  public ResponseEntity<?> anhGiay(
      @PathVariable("id") UUID id, @RequestBody List<UUID> anhGiayIds) {
    return ResponseEntity.ok(giayChiTietService.assignAnhGiay(id, anhGiayIds));
  }

  @GetMapping("/getAll/{giayId}")
  public ResponseEntity<List<GiayChiTietEntity>> getGiayChiTietByGiayId(@PathVariable UUID giayId) {
    List<GiayChiTietEntity> chiTietList = giayChiTietService.getAllGiayChiTietByGiayId(giayId);
    return ResponseEntity.ok(chiTietList);
  }
  @GetMapping("/loc")
  public ResponseEntity<List<GiayChiTietEntity>> filterGiayChiTiet(
          @RequestParam(required = false) UUID mauSacId,
          @RequestParam(required = false) UUID kichCoId,
          @RequestParam(required = false) UUID thuongHieuId) {

    List<GiayChiTietEntity> result = giayChiTietService.filterGiayChiTiet(mauSacId, kichCoId, thuongHieuId);
    return ResponseEntity.ok(result);
  }
}
