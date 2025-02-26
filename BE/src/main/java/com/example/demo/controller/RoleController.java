package com.example.demo.controller;

import com.example.demo.dto.request.RoleDto;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(roleService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.add(roleDto));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.update(roleDto));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable UUID id) {
        RoleDto roleDto = new RoleDto();
        roleDto.setId(id);
        return ResponseEntity.ok(roleService.detail(roleDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.delete(roleDto));
    }
}
