package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface QRCodeService {
    String scanAndAddToHoaDonCho(MultipartFile file) throws IOException;
    String scanAndAddToHoaDonChoFromWebcam();
    //ok
}
