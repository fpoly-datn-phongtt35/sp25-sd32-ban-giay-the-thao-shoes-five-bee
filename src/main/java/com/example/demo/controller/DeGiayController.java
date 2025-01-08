package com.example.demo.controller;

import com.example.demo.dto.request.DeGiayDto;
import com.example.demo.dto.request.DeGiayUpdateDto;
import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.service.DeGiayService;
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
@RequestMapping("/de-giay")
public class DeGiayController {
    @Autowired
   private DeGiayService deGiayService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(deGiayService.getAll());
    }

    @PostMapping("/search")
    public ResponseEntity<?> findAndPageChatLieu(@RequestBody DeGiayDto deGiayDto){
        Pageable pageable = PageRequest.of(deGiayDto.getPage(),deGiayDto.getSize());
        return ResponseEntity.ok(deGiayService.findByPagingCriteria(deGiayDto,pageable));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody DeGiayDto deGiayDto){
        return ResponseEntity.ok(deGiayService.add(deGiayDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.update(deGiayUpdateDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.detail(deGiayUpdateDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody DeGiayUpdateDto deGiayUpdateDto){
        return ResponseEntity.ok(deGiayService.delete(deGiayUpdateDto));
    }
}
