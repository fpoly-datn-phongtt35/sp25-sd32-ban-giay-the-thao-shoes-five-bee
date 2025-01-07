package com.example.demo.service;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AnhGiayService {
    String uploadImage(MultipartFile file) throws IOException;
    AnhGiayEntity add(AnhGiayDto anhGiayDto, String tenUrl) throws IOException;
}
