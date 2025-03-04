package com.example.demo.controller;

import com.example.demo.service.GioHangChiTietService;
import com.example.demo.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/gio-hang")
public class GioHangController {
  @Autowired private GioHangService gioHangService;

  @Autowired private GioHangChiTietService gioHangChiTietService;

  @GetMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(gioHangService.getCartItems());
  }

  @GetMapping("/tong-so-luong/{idGioHang}")
  public ResponseEntity<Integer> getTotalProductsInCart(@PathVariable UUID idGioHang){
    Integer totalProducts = gioHangChiTietService.getTotalProductsInCart(idGioHang);
    return ResponseEntity.ok(totalProducts !=null ? totalProducts : 0);
  }
}
