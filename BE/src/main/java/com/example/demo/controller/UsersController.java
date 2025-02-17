package com.example.demo.controller;

import com.example.demo.dto.request.UserDto;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;

@RestController
@RequestMapping("/user")
public class UsersController {
    @Autowired
    private UsersService usersService;

    @PostMapping("/getAll")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(usersService.getAll());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestPart("userDto") UserDto userDto, @RequestParam("file")MultipartFile file)throws IOException {
        usersService.add(userDto,file);
        return ResponseEntity.ok(Collections.singletonMap("message","add success"));
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestPart("userDto") UserDto userDto, @RequestParam(value = "file", required = false) MultipartFile file) throws IOException{
        usersService.update(userDto,file);
        return ResponseEntity.ok(Collections.singletonMap("message","update success"));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody UserDto userDto){
        usersService.delete(userDto);
        return ResponseEntity.ok(Collections.singletonMap("message","delete success"));
    }

    @PostMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody UserDto userDto){
        return ResponseEntity.ok(usersService.detail(userDto));
    }
}
