package com.example.demo.controller;

import com.example.demo.dto.request.RoleDto;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(roleService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.add(roleDto));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.update(roleDto));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.detail(roleDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.delete(roleDto));
    }
}
