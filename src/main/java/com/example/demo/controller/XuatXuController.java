package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.ThuongHieuService;
import com.example.demo.service.XuatXuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/xuat-xu")
public class XuatXuController {
    @Autowired
   private XuatXuService xuatXuService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(xuatXuService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageXuatXu(@RequestBody XuatXuDto xuatXuDto){
        Pageable pageable = PageRequest.of(xuatXuDto.getPage(),xuatXuDto.getSize());
        return ResponseEntity.ok(xuatXuService.findByPagingCriteria(xuatXuDto,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody XuatXuDto xuatXuDto){
        return ResponseEntity.ok(xuatXuService.add(xuatXuDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody XuatXuUpdateDto xuatXuUpdateDto){
        return ResponseEntity.ok(xuatXuService.update(xuatXuUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody XuatXuUpdateDto xuatXuUpdateDto){
        return ResponseEntity.ok(xuatXuService.detail(xuatXuUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody XuatXuUpdateDto xuatXuUpdateDto){
        return ResponseEntity.ok(xuatXuService.delete(xuatXuUpdateDto));
    }
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhXuatXu(@RequestBody XuatXuDto xuatXuDto) {
        try {
            XuatXuEntity xuatXuEntity = xuatXuService.addNhanh(xuatXuDto);
            return ResponseEntity.ok(xuatXuEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
