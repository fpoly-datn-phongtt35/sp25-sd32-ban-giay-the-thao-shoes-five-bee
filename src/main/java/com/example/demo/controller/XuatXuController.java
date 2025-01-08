package com.example.demo.controller;

import com.example.demo.dto.request.ThuongHieuDto;
import com.example.demo.dto.request.ThuongHieuUpdateDto;
import com.example.demo.dto.request.XuatXuDto;
import com.example.demo.dto.request.XuatXuUpdateDto;
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
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody XuatXuDto xuatXuDto){
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
}
