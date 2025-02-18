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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/thuong-hieu")
public class ThuongHieuController {
    @Autowired
   private ThuongHieuService thuongHieuService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(thuongHieuService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageThuongHieu(@RequestBody ThuongHieuDto thuongHieuDto){
        Pageable pageable = PageRequest.of(thuongHieuDto.getPage(),thuongHieuDto.getSize());
        return ResponseEntity.ok(thuongHieuService.findByPagingCriteria(thuongHieuDto,pageable));
    }
 
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuongHieuDto thuongHieuDto){
        return ResponseEntity.ok(thuongHieuService.add(thuongHieuDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.update(thuongHieuUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.detail(thuongHieuUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody ThuongHieuUpdateDto thuongHieuUpdateDto){
        return ResponseEntity.ok(thuongHieuService.delete(thuongHieuUpdateDto));
    }
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhThuongHieu(@RequestBody ThuongHieuDto thuongHieuDto) {
        try {
            ThuongHieuEntity thuongHieuEntity = thuongHieuService.addNhanh(thuongHieuDto);
            return ResponseEntity.ok(thuongHieuEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
