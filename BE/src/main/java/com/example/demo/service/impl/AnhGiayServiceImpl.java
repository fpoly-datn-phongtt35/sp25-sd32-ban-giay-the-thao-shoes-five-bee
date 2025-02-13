package com.example.demo.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.repository.AnhGiayRepository;
import com.example.demo.service.AnhGiayService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnhGiayServiceImpl implements AnhGiayService {
    @Autowired
    private AnhGiayRepository anhGiayRepository;

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        String publicValue = generatePublicValue(file.getOriginalFilename());
        String extension = getFileName(file.getOriginalFilename())[1];
        File fileUpload = convert(file);
        cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id",publicValue));
        cleanDisk(fileUpload);
        return  cloudinary.url().generate(StringUtils.join(publicValue, ".", extension));
    }

    @Override
    public AnhGiayEntity add(AnhGiayDto anhGiayDto, String tenUrl) throws IOException {
        AnhGiayEntity anhGiayEntity = new AnhGiayEntity();
        anhGiayEntity.setTenUrl(tenUrl);
        anhGiayEntity.setTrangThai(anhGiayDto.getTrangThai());
        return anhGiayRepository.save(anhGiayEntity);
    }
    private File convert(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File convFile = new File(System.getProperty("java.io.tmpdir"), fileName);
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, convFile.toPath());
        }
        return convFile;
    }
    private void cleanDisk(File file) {
        try {
            log.info("file.toPath(): {}", file.toPath());
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            log.error("Error");
        }
    }

    public String generatePublicValue(String originalName){
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    public String[] getFileName(String originalName) {
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex > 0) {
            return new String[]{
                    originalName.substring(0, dotIndex),
                    originalName.substring(dotIndex + 1)
            };
        }
        return new String[]{originalName, ""};
    }


    @Override
    public void assignToGiayByAnhGiayIdAndIds(
            @NonNull UUID giayId, @NonNull List<UUID> ids) {
        anhGiayRepository.assignToGiayByAnhGiayIdAndIds(giayId, ids);
    }

    @Override
    public List<AnhGiayEntity> getAll() {
        return anhGiayRepository.findAll();
    }
}


