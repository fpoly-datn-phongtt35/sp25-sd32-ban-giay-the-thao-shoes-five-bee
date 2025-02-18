package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.KieuDangEntity;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.service.KieuDangService;
import com.example.demo.service.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/kieu-dang")
public class KieuDangController {
    @Autowired
   private KieuDangService kieuDangService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(kieuDangService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageKieuDang(@RequestBody KieuDangDto kieuDangDto){
        Pageable pageable = PageRequest.of(kieuDangDto.getPage(),kieuDangDto.getSize());
        return ResponseEntity.ok(kieuDangService.findByPagingCriteria(kieuDangDto,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody KieuDangDto kieuDangDto){
        return ResponseEntity.ok(kieuDangService.add(kieuDangDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.update(kieuDangUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.detail(kieuDangUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody KieuDangUpdateDto kieuDangUpdateDto){
        return ResponseEntity.ok(kieuDangService.delete(kieuDangUpdateDto));
    }
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhKieuDang(@RequestBody KieuDangDto kieuDangDto) {
        try {
            KieuDangEntity kieuDangEntity = kieuDangService.addNhanh(kieuDangDto);
            return ResponseEntity.ok(kieuDangEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
