package com.example.demo.controller;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dia-chi")
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(diaChiService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PostMapping("/add/user/{idUser}")
    public ResponseEntity<?> add(@PathVariable UUID idUser,@RequestBody DiaChiDto diaChiDto){
        diaChiService.add(idUser,diaChiDto);
        return ResponseEntity.ok(Collections.singletonMap("message","add success"));
    }

    @PreAuthorize("hasRole('USER')" )
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id,@RequestBody DiaChiDto diaChiDto){
        diaChiService.update(id,diaChiDto);
        return ResponseEntity.ok(Collections.singletonMap("message","update success"));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id){
        diaChiService.delete(id);
        return ResponseEntity.ok(Collections.singletonMap("message","delete success"));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('USER')" )
    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody DiaChiDto diaChiDto){
        return ResponseEntity.ok(diaChiService.detail(diaChiDto));
    }

    @PreAuthorize("hasRole('USER')" )
    @GetMapping("/user/{idUser}")
    public ResponseEntity<List<DiaChiEntity>> getDiaChiByIdUser(@PathVariable UUID idUser){
        List<DiaChiEntity> diaChiEntities = diaChiService.getDiaChiByIdUser(idUser);
        return new ResponseEntity<>(diaChiEntities, HttpStatus.OK);
    }

}
