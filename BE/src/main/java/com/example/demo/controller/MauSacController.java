package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.KichCoService;
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
@RequestMapping("/mau-sac")
public class MauSacController {
    @Autowired
   private MauSacService mauSacService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(mauSacService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageMausac(@RequestBody MauSacDto mauSacDto){
        Pageable pageable = PageRequest.of(mauSacDto.getPage(),mauSacDto.getSize());
        return ResponseEntity.ok(mauSacService.findByPagingCriteria(mauSacDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody MauSacDto mauSacDto){
        return ResponseEntity.ok(mauSacService.add(mauSacDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.update(mauSacUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.detail(mauSacUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.delete(mauSacUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhMauSac(@RequestBody MauSacDto mauSacDto) {
        try {
            MauSacEntity mauSacEntity = mauSacService.addNhanh(mauSacDto);
            return ResponseEntity.ok(mauSacEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/toggle-trangthai")
    public MauSacEntity toggleTrangThai(@RequestBody MauSacUpdateDto mauSacUpdateDto) {
        return mauSacService.toggleTrangThai(mauSacUpdateDto);
    }
}
