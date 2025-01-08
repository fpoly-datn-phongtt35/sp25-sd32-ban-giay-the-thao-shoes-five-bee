package com.example.demo.controller;

import com.example.demo.dto.request.*;
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
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody KieuDangDto kieuDangDto){
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
}
