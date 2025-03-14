package com.example.demo.service;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import lombok.NonNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface AnhGiayService {
    String uploadImage(MultipartFile file) throws IOException;
    AnhGiayEntity add(AnhGiayDto anhGiayDto, String tenUrl) throws IOException;
    void assignToGiayByAnhGiayIdAndIds(
            @NonNull UUID giayId, @NonNull List<UUID> ids);
    void assignToGiayChiTietByAnhGiayIdAndIds(@NonNull UUID giayId, @NonNull List<UUID> ids);

    List<AnhGiayEntity> getAll();
    AnhGiayEntity detail (AnhGiayDto anhGiayDto);
    AnhGiayEntity update(AnhGiayDto anhGiayDto);
    AnhGiayEntity delete(AnhGiayDto anhGiayDto);
    List<AnhGiayEntity> assignToGiayChiTietAndGetAnh(UUID giayChiTietId, List<UUID> anhGiayIds);
    List<AnhGiayEntity> getAnhByGiayChiTietId(UUID giayChiTietId);

    String uploadImage2(MultipartFile file) throws IOException;
    AnhGiayEntity addAnhToGiayChiTiet(UUID giayChiTietId, String imageUrl,int trangThai);

}
