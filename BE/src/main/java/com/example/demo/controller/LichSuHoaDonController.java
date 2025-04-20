package com.example.demo.controller;

import com.example.demo.dto.request.LichSuHoaDonDto;
import com.example.demo.entity.LichSuHoaDonEntity;
import com.example.demo.service.LichSuHoaDonService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lich-su-hoa-don")
@RequiredArgsConstructor
public class LichSuHoaDonController {

  private final LichSuHoaDonService lichSuHoaDonService;

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/getAll")
  public ResponseEntity<?> getAll() {
    // Lấy tất cả lịch sử hóa đơn từ service
    List<LichSuHoaDonEntity> lichSuList = lichSuHoaDonService.getAll();

    // Chuyển đổi entity thành DTO và thêm mã hóa đơn
    List<LichSuHoaDonDto> lichSuDTOs = lichSuList.stream()
            .map(entity -> {
              LichSuHoaDonDto dto = new LichSuHoaDonDto();
              dto.setId(entity.getId());
              dto.setTrangThaiCu(entity.getTrangThaiCu());
              dto.setTrangThaiMoi(entity.getTrangThaiMoi());
              dto.setNguoiCapNhat(entity.getNguoiCapNhat());
              dto.setThoiGianCapNhat(entity.getThoiGianCapNhat());
              dto.setGhiChu(entity.getGhiChu());
              // Lấy mã hóa đơn từ HoaDonEntity
              dto.setMaHoaDon(entity.getHoaDonEntity().getMa());  // Mã hóa đơn
              return dto;
            })
            .collect(Collectors.toList());

    // Trả về danh sách DTO
    return ResponseEntity.ok(lichSuDTOs);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/search")
  public ResponseEntity<?> findAndPageLichSuHoaDon(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    Pageable pageable = PageRequest.of(lichSuHoaDonDto.getPage(), lichSuHoaDonDto.getSize());
    return ResponseEntity.ok(lichSuHoaDonService.findByPagingCriteria(lichSuHoaDonDto, pageable));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    return ResponseEntity.ok(lichSuHoaDonService.add(lichSuHoaDonDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @PutMapping("/update")
  public ResponseEntity<?> update(@RequestBody LichSuHoaDonDto lichSuHoaDonDto) {
    return ResponseEntity.ok(lichSuHoaDonService.update(lichSuHoaDonDto));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/detail/{id}")
  public ResponseEntity<?> detail(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(lichSuHoaDonService.detail(id));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> delete(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(lichSuHoaDonService.delete(id));
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
  @GetMapping("/hoa-don")
  public ResponseEntity<?> getLichSuHoaDonByHoaDonId(@RequestParam UUID hoaDonId) {
    // Lấy danh sách lịch sử hóa đơn từ service
    List<LichSuHoaDonEntity> lichSuList = lichSuHoaDonService.getListLichSuHoaDonByHoaDonId(hoaDonId);

    // Chuyển đổi thành DTO và thêm mã hóa đơn
    List<LichSuHoaDonDto> lichSuDTOs = lichSuList.stream()
            .map(entity -> {
              LichSuHoaDonDto dto = new LichSuHoaDonDto();
              dto.setId(entity.getId());
              dto.setTrangThaiCu(entity.getTrangThaiCu());
              dto.setTrangThaiMoi(entity.getTrangThaiMoi());
              dto.setNguoiCapNhat(entity.getNguoiCapNhat());
              dto.setThoiGianCapNhat(entity.getThoiGianCapNhat());
              dto.setGhiChu(entity.getGhiChu());
              // Lấy mã hóa đơn từ HoaDonEntity
              dto.setMaHoaDon(entity.getHoaDonEntity().getMa());  // Mã hóa đơn
              return dto;
            })
            .collect(Collectors.toList());

    return ResponseEntity.ok(lichSuDTOs);  // Trả về danh sách DTO
  }

}
