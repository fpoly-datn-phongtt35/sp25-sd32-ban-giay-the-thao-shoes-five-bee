package com.example.demo.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.repository.AnhGiayRepository;
import com.example.demo.repository.GiayChiTietRepository;
import com.example.demo.service.AnhGiayService;
import lombok.Builder;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnhGiayServiceImpl implements AnhGiayService {
    @Autowired
    private final AnhGiayRepository anhGiayRepository;
    private final GiayChiTietRepository giayChiTietRepository;

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
    public void assignToGiayChiTietByAnhGiayIdAndIds(@NonNull UUID giayId, @NonNull List<UUID> ids) {

        if (ids.isEmpty()) {
            throw new IllegalArgumentException("Danh sách ID ảnh không được rỗng!");
        }


        giayChiTietRepository.findById(giayId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Giày Chi Tiết với ID: " + giayId));

        anhGiayRepository.assignToGiayChiTietByAnhGiayIdAndIds(giayId, ids);

    }

    @Override
    public List<AnhGiayEntity> getAll() {
        return anhGiayRepository.findAll();
    }

    @Override
    public AnhGiayEntity detail(AnhGiayDto anhGiayDto) {
        Optional<AnhGiayEntity> optional = anhGiayRepository.findById(anhGiayDto.getId());
        return optional.orElse(null);
    }


    @Override
    public AnhGiayEntity update(AnhGiayDto anhGiayDto) {
        Optional<AnhGiayEntity> optional = anhGiayRepository.findById(anhGiayDto.getId());
        return optional.map(o->{
            o.setTenUrl(anhGiayDto.getTenUrl());
            o.setTrangThai(anhGiayDto.getTrangThai());
            o.setGiayEntity(anhGiayDto.getGiayEntity());
            return anhGiayRepository.save(o);
        }).orElse(null);
    }

    @Override
    public AnhGiayEntity delete(AnhGiayDto anhGiayDto) {
        Optional<AnhGiayEntity> optional = anhGiayRepository.findById(anhGiayDto.getId());
        return optional.map(o->{
            anhGiayRepository.delete(o);
            return o;
        }).orElse(null);
    }
    @Override
    @Transactional
    public List<AnhGiayEntity> assignToGiayChiTietAndGetAnh(UUID giayChiTietId, List<UUID> anhGiayIds) {
        if (anhGiayIds.isEmpty()) {
            throw new IllegalArgumentException("Danh sách ID ảnh không được rỗng!");
        }


        GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(giayChiTietId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Giày Chi Tiết với ID: " + giayChiTietId));

        // Gán ảnh vào Giày Chi Tiết
        anhGiayRepository.assignToGiayChiTietByAnhGiayIdAndIds(giayChiTietId, anhGiayIds);

        // Trả về danh sách ảnh sau khi gán
        return anhGiayRepository.findAnhByGiayChiTietId(giayChiTietId);
    }
    @Override
    public List<AnhGiayEntity> getAnhByGiayChiTietId(UUID giayChiTietId) {
        return anhGiayRepository.findAnhByGiayChiTietId(giayChiTietId);
    }
    @Override
    public String uploadImage2(MultipartFile file) throws IOException {
        File fileUpload = convert(file);
        String publicId = UUID.randomUUID().toString();
        cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id", publicId));
        return cloudinary.url().generate(publicId);
    }

    @Override
    @Transactional
    public AnhGiayEntity addAnhToGiayChiTiet(UUID giayChiTietId, String imageUrl, int trangThai) {
        GiayChiTietEntity giayChiTiet = giayChiTietRepository.findById(giayChiTietId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy GiayChiTiet với ID: " + giayChiTietId));

        AnhGiayEntity anhGiay = AnhGiayEntity.builder()
                .tenUrl(imageUrl)
                .trangThai(trangThai)  // ✅ Set trạng thái mặc định là 0
                .giayChiTietEntity(giayChiTiet)
                .build();

        return anhGiayRepository.save(anhGiay);
    }



}






