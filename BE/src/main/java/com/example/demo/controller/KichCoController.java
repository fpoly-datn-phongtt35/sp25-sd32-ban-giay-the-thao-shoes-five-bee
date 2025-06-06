package com.example.demo.controller;

import com.example.demo.dto.request.*;
import com.example.demo.entity.DeGiayEntity;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.XuatXuEntity;
import com.example.demo.service.ChatLieuService;
import com.example.demo.service.KichCoService;
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
@RequestMapping("/kich-co")
public class KichCoController {
    @Autowired
    private KichCoService kichCoService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(kichCoService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageKichCo(@RequestBody KichCoDto kichCoDto){
        Pageable pageable = PageRequest.of(kichCoDto.getPage(),kichCoDto.getSize());
        return ResponseEntity.ok(kichCoService.findByPagingCriteria(kichCoDto,pageable));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody KichCoDto kichCoDto){
        return ResponseEntity.ok(kichCoService.add(kichCoDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody KichCoUpdateDto kichCoUpdateDto){
        return ResponseEntity.ok(kichCoService.update(kichCoUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody KichCoUpdateDto kichCoUpdateDto){
        return ResponseEntity.ok(kichCoService.detail(kichCoUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody KichCoUpdateDto kichCoUpdateDto){
        return ResponseEntity.ok(kichCoService.delete(kichCoUpdateDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/addNhanh")
    public ResponseEntity<?> addNhanhKichCo(@RequestBody KichCoDto kichCoDto) {
        try {
            KichCoEntity kichCoEntity = kichCoService.addNhanh(kichCoDto);
            return ResponseEntity.ok(kichCoEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/toggle-trangthai")
    public KichCoEntity toggleTrangThai(@RequestBody KichCoUpdateDto kichCoUpdateDto) {
        return kichCoService.toggleKichCo(kichCoUpdateDto);
    }
}
