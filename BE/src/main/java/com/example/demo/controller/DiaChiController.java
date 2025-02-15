package com.example.demo.controller;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dia-chi")
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(diaChiService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.add(diaChiDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.update(diaChiDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.delete(diaChiDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.detail(diaChiDto));
    }

}
