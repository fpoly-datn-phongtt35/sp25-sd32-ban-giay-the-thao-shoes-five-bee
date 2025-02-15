package com.example.demo.controller;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.GioHangChiTietService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/gio-hang-chi-tiet")
public class GioHangChiTietController {

    @Autowired
    private GioHangChiTietService gioHangChiTietService;

    @PostMapping("/add-to-cart")
    public ResponseEntity<String> addToCart(@RequestParam UUID userId, @RequestParam UUID giayChiTietId, @RequestParam int soLuong) {
        UserEntity user = new UserEntity();
        user.setId(userId);
        GiayChiTietEntity giayChiTiet = new GiayChiTietEntity();
        giayChiTiet.setId(giayChiTietId);

        gioHangChiTietService.addToCart(user, giayChiTiet, soLuong);
        return ResponseEntity.ok("Thêm sản phẩm vào giỏ hàng thành công");
    }


}
