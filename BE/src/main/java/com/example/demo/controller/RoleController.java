package com.example.demo.controller;

import com.example.demo.dto.request.RoleDto;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @GetMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(roleService.getAll());
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.add(roleDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.update(roleDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable UUID id) {
        RoleDto roleDto = new RoleDto();
        roleDto.setId(id);
        return ResponseEntity.ok(roleService.detail(roleDto));
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')" )
    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody RoleDto roleDto){
        return ResponseEntity.ok(roleService.delete(roleDto));
    }
}
