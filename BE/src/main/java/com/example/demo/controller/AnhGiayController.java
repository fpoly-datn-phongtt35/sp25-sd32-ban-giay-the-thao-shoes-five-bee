package com.example.demo.controller;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.service.AnhGiayService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/anh-giay")
public class AnhGiayController {
    @Autowired
    private AnhGiayService anhGiayService;
    @PostMapping("/add")
    public AnhGiayEntity uploadImage(@RequestPart("data")AnhGiayDto anhGiayDto,
                                     @RequestPart("file")MultipartFile file) throws IOException{
        String uploadImage = anhGiayService.uploadImage(file);
        return anhGiayService.add(anhGiayDto,uploadImage);
    }
    @GetMapping("/getAll")
    public List<AnhGiayEntity> getAll() {
        return anhGiayService.getAll();
    }
}
