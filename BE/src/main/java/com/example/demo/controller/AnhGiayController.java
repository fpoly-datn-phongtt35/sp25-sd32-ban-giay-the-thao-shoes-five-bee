package com.example.demo.controller;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.service.AnhGiayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/anh-giay")
public class AnhGiayController {
    @Autowired
    private AnhGiayService anhGiayService;
    @PostMapping("/add")

    @GetMapping("/getAll")
    public List<AnhGiayEntity> getAll() {
        return anhGiayService.getAll();
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody AnhGiayDto anhGiayDto){
        return ResponseEntity.ok(anhGiayService.update(anhGiayDto));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody AnhGiayDto anhGiayDto){
        return ResponseEntity.ok(anhGiayService.delete(anhGiayDto));
    }

    @GetMapping("/detail")
    public ResponseEntity<?> detail(@RequestBody AnhGiayDto anhGiayDto){
        return ResponseEntity.ok(anhGiayService.detail(anhGiayDto));
    }
    @GetMapping("/get-anh-giay-chi-tiet/{giayChiTietId}")
    public ResponseEntity<List<AnhGiayEntity>> getAnhByGiayChiTietId(@PathVariable UUID giayChiTietId) {
        List<AnhGiayEntity> danhSachAnh = anhGiayService.getAnhByGiayChiTietId(giayChiTietId);
        return ResponseEntity.ok(danhSachAnh);
    }


    @PostMapping(value = "/giay-chi-tiet", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAndAssignImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam UUID giayChiTietId,
            HttpServletRequest request) {

        System.out.println("🔥 Nhận request upload ảnh:");
        System.out.println("🔥 giayChiTietId: " + giayChiTietId);

        // Kiểm tra request có chứa phần multipart không
        if (!(request instanceof MultipartHttpServletRequest)) {
            System.out.println("🚨 Request không chứa multipart data!");
            return ResponseEntity.badRequest().body("🚨 Request không chứa multipart data!");
        }

        try {
            System.out.println("🔥 File nhận được: " + (file != null ? file.getOriginalFilename() : "null"));

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("🚨 File upload không được để trống!");
            }

            // Upload ảnh lên Cloudinary
            String uploadedImageUrl = anhGiayService.uploadImage(file);
            if (uploadedImageUrl == null || uploadedImageUrl.isEmpty()) {
                return ResponseEntity.internalServerError().body("🚨 Lỗi khi upload ảnh!");
            }

            // Thêm ảnh vào GiayChiTietEntity với trạng thái mặc định = 0
            AnhGiayEntity savedAnh = anhGiayService.addAnhToGiayChiTiet(giayChiTietId, uploadedImageUrl, 0);

            return ResponseEntity.ok(savedAnh);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("🚨 Lỗi khi xử lý file upload: " + e.getMessage());
        }
    }



}
