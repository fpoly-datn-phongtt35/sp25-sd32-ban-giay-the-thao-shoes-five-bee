package com.example.demo.controller;

import com.example.demo.dto.request.DanhMucDto;
import com.example.demo.dto.request.DanhMucUpdateDto;

import com.example.demo.entity.DanhMucEntity;

import com.example.demo.service.DanhMucService;
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
@RequestMapping("/danh-muc")
public class DanhMucController {
    @Autowired
    private DanhMucService danhMucService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(danhMucService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageDanhMuc(@RequestBody DanhMucDto danhMucDto){
        Pageable pageable = PageRequest.of(danhMucDto.getPage(),danhMucDto.getSize());
        return ResponseEntity.ok(danhMucService.findByPagingCriteria(danhMucDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody DanhMucDto danhMucDto){
        return ResponseEntity.ok(danhMucService.add(danhMucDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DanhMucUpdateDto danhMucUpdateDto){
        return ResponseEntity.ok(danhMucService.update(danhMucUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DanhMucUpdateDto danhMucUpdateDto){
        return ResponseEntity.ok(danhMucService.detail(danhMucUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody DanhMucUpdateDto danhMucUpdateDto){
        return ResponseEntity.ok(danhMucService.delete(danhMucUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhDanhMuc(@RequestBody DanhMucDto danhMucDto) {
        try {
            DanhMucEntity danhMuc = danhMucService.addNhanh(danhMucDto);
            return ResponseEntity.ok(danhMuc);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/toggle-trangthai")
    public DanhMucEntity toggleTrangThai(@RequestBody DanhMucUpdateDto danhMucUpdateDto) {
        return danhMucService.toggleTrangThai(danhMucUpdateDto);
    }
}
//danhmuc