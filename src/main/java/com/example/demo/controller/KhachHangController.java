package com.example.demo.controller;


import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.dto.request.KhachHangDto;

import com.example.demo.entity.DiaChiEntity;
import com.example.demo.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/khach-hang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;


    @PostMapping("/add")
    public ResponseEntity<KhachHangDto> createKhachHang(@RequestBody KhachHangDto khachHangDto) {
        KhachHangDto createdKhachHang = khachHangService.createUser(khachHangDto);
        return new ResponseEntity<>(createdKhachHang, HttpStatus.CREATED);
    }


    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(khachHangService.getAllUsers());
    }
    @PostMapping("/search")
    public ResponseEntity<?> findAndPageKhachHang(@RequestBody KhachHangDto khachHangDto){
        Pageable pageable = PageRequest.of(khachHangDto.getPage(),khachHangDto.getSize());
        return ResponseEntity.ok(khachHangService.findByPagingCriteria(khachHangDto,pageable));
    }


    @GetMapping("/getKhachHang/{id}")
    public ResponseEntity<KhachHangDto> getKhachHangById(@PathVariable("id") UUID id) {
        return khachHangService.getUserById(id)
                .map(khachHangDto -> new ResponseEntity<>(khachHangDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<KhachHangDto> updateKhachHang(@PathVariable("id") UUID id,
                                                        @RequestBody KhachHangDto updatedKhachHangDto) {
        KhachHangDto updatedKhachHang = khachHangService.updateUser(id, updatedKhachHangDto);
        if (updatedKhachHang != null) {
            return new ResponseEntity<>(updatedKhachHang, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<KhachHangDto> getKhachHangDetails(@PathVariable("id") UUID id) {
        KhachHangDto khachHangDto = khachHangService.getKhachHangDetails(id);
        if (khachHangDto != null) {
            return new ResponseEntity<>(khachHangDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteKhachHang(@PathVariable("id") UUID id) {
        boolean isDeleted = khachHangService.deleteUser(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update/dia-chi/{id}")
    public ResponseEntity<KhachHangDto> updateDiaChi(@PathVariable("id") UUID addressId,
                                                     @RequestBody DiaChiDto diaChiDto) {
        try {
            KhachHangDto updatedKhachHang = khachHangService.updateAddress(addressId, diaChiDto);

            return new ResponseEntity<>(updatedKhachHang, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
