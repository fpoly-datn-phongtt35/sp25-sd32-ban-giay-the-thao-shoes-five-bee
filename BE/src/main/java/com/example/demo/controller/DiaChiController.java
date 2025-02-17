package com.example.demo.controller;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

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
        diaChiService.add(diaChiDto);
        return ResponseEntity.ok(Collections.singletonMap("message","add success"));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody DiaChiDto diaChiDto){
        diaChiService.update(diaChiDto);
        return ResponseEntity.ok(Collections.singletonMap("message","update success"));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody DiaChiDto diaChiDto){
        diaChiService.delete(diaChiDto);
        return ResponseEntity.ok(Collections.singletonMap("message","delete success"));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.detail(diaChiDto));
    }

}
