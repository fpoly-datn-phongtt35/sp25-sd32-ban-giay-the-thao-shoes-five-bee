package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.DeGiayEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.DeGiayService;
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
@RequestMapping("/de-giay")
public class DeGiayController {
    @Autowired
   private DeGiayService deGiayService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(deGiayService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageDeGiay(@RequestBody DeGiayDto deGiayDto){
        Pageable pageable = PageRequest.of(deGiayDto.getPage(),deGiayDto.getSize());
        return ResponseEntity.ok(deGiayService.findByPagingCriteria(deGiayDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody DeGiayDto deGiayDto){
        return ResponseEntity.ok(deGiayService.add(deGiayDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.update(deGiayUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.detail(deGiayUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.delete(deGiayUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhDeGiaiy(@RequestBody DeGiayDto deGiayDto) {
        try {
            DeGiayEntity deGiay = deGiayService.addNhanh(deGiayDto);
            return ResponseEntity.ok(deGiay);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/toggle-trangthai")
    public DeGiayEntity toggleTrangThai(@RequestBody DeGiayUpdateDto deGiayUpdateDto) {
        return deGiayService.toggleTrangThai(deGiayUpdateDto);
    }
}
