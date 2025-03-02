package com.example.demo.controller;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/dia-chi")
public class DiaChiController {

  @Autowired private DiaChiService diaChiService;

  @PostMapping("/getAll")
  public ResponseEntity<?> getAll() {
    return ResponseEntity.ok(diaChiService.getAll());
  }

  @GetMapping("/get-by-user")
  public ResponseEntity<?> getByUser(@PathVariable("idUser") UUID idUser) {
    return ResponseEntity.ok(diaChiService.getListDiaChiByUser(idUser));
  }

  @PostMapping("/add")
  public ResponseEntity<?> add(@RequestBody DiaChiDto diaChiDto) {
    diaChiService.add(diaChiDto);
    return ResponseEntity.ok(Collections.singletonMap("message", "add success"));
  }

  @PostMapping("/update")
  public ResponseEntity<?> update(@RequestBody DiaChiDto diaChiDto) {
    diaChiService.update(diaChiDto);
    return ResponseEntity.ok(Collections.singletonMap("message", "update success"));
  }

  @PostMapping("/delete")
  public ResponseEntity<?> delete(@RequestBody DiaChiDto diaChiDto) {
    diaChiService.delete(diaChiDto);
    return ResponseEntity.ok(Collections.singletonMap("message", "delete success"));
  }

  @PostMapping("/detail")
  public ResponseEntity<?> detail(@RequestBody DiaChiDto diaChiDto) {
    return ResponseEntity.ok(diaChiService.detail(diaChiDto));
  }
}
