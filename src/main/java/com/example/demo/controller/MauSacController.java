package com.example.demo.controller;

import com.example.demo.dto.request.KichCoDto;
import com.example.demo.dto.request.KichCoUpdateDto;
import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.service.KichCoService;
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
@RequestMapping("/mau-sac")
public class MauSacController {
    @Autowired
   private MauSacService mauSacService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(mauSacService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageMausac(@RequestBody MauSacDto mauSacDto){
        Pageable pageable = PageRequest.of(mauSacDto.getPage(),mauSacDto.getSize());
        return ResponseEntity.ok(mauSacService.findByPagingCriteria(mauSacDto,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody MauSacDto mauSacDto){
        return ResponseEntity.ok(mauSacService.add(mauSacDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.update(mauSacUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.detail(mauSacUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody MauSacUpdateDto mauSacUpdateDto){
        return ResponseEntity.ok(mauSacService.delete(mauSacUpdateDto));
    }
}
