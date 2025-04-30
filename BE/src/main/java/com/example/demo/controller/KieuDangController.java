package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.KieuDangEntity;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.KieuDangService;
import com.example.demo.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kieu-dang")
public class KieuDangController {
    @Autowired
   private KieuDangService kieuDangService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(kieuDangService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageKieuDang(@RequestBody KieuDangDto kieuDangDto){
        Pageable pageable = PageRequest.of(kieuDangDto.getPage(),kieuDangDto.getSize());
        return ResponseEntity.ok(kieuDangService.findByPagingCriteria(kieuDangDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody KieuDangDto kieuDangDto){
        return ResponseEntity.ok(kieuDangService.add(kieuDangDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.update(kieuDangUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.detail(kieuDangUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.delete(kieuDangUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhKieuDang(@RequestBody KieuDangDto kieuDangDto) {
        try {
            KieuDangEntity kieuDangEntity = kieuDangService.addNhanh(kieuDangDto);
            return ResponseEntity.ok(kieuDangEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/toggle-trangthai")
    public KieuDangEntity toggleTrangThai(@RequestBody KieuDangUpdateDto kieuDangUpdateDto) {
        return kieuDangService.toggleTrangThai(kieuDangUpdateDto);
    }
}
