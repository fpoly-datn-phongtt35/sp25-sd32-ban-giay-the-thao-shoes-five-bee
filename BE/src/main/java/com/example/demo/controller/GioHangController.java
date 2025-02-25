package com.example.demo.controller;

import com.example.demo.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gio-hang")
public class GioHangController {
  @Autowired private GioHangService gioHangService;

  @GetMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(gioHangService.getCartItems());
  }
}
