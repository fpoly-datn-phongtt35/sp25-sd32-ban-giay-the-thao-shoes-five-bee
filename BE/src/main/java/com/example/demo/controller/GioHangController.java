package com.example.demo.controller;

import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/gio-hang")
public class GioHangController {
    @Autowired
    private GioHangService gioHangService;

    @PostMapping("/{userId}")
    public ResponseEntity<GioHangEntity> getGioHang(@PathVariable UUID userId) {
        UserEntity user = new UserEntity();
        user.setId(userId);
        GioHangEntity gioHang = gioHangService.getOrCreateGioHang(user);
        return ResponseEntity.ok(gioHang);
    }


}
