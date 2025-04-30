package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.MauSacService;
import com.example.demo.service.ThuongHieuService;
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
@RequestMapping("/thuong-hieu")
public class ThuongHieuController {
    @Autowired
   private ThuongHieuService thuongHieuService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(thuongHieuService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageThuongHieu(@RequestBody ThuongHieuDto thuongHieuDto){
        Pageable pageable = PageRequest.of(thuongHieuDto.getPage(),thuongHieuDto.getSize());
        return ResponseEntity.ok(thuongHieuService.findByPagingCriteria(thuongHieuDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuongHieuDto thuongHieuDto){
        return ResponseEntity.ok(thuongHieuService.add(thuongHieuDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.update(thuongHieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.detail(thuongHieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.delete(thuongHieuUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhThuongHieu(@RequestBody ThuongHieuDto thuongHieuDto) {
        try {
            ThuongHieuEntity thuongHieuEntity = thuongHieuService.addNhanh(thuongHieuDto);
            return ResponseEntity.ok(thuongHieuEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/toggle-trangthai")
    public ThuongHieuEntity toggleTrangThai(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto) {
        return thuongHieuService.toggleTrangThai(thuongHieuUpdateDto);
    }
}
