package com.example.demo.service;

import com.example.demo.dto.request.AnhGiayDto;
import com.example.demo.entity.AnhGiayEntity;
import lombok.NonNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface AnhGiayService {
    String uploadImage(MultipartFile file) throws IOException;
    AnhGiayEntity add(AnhGiayDto anhGiayDto, String tenUrl) throws IOException;

    void assignToGiayByAnhGiayIdAndIds(
            @NonNull Long giayId, @NonNull List<Long> ids);
}
