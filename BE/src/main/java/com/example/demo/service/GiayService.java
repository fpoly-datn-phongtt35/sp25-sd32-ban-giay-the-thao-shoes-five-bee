package com.example.demo.service;

import com.example.demo.dto.request.GiayDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiayEntity;
import lombok.NonNull;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface GiayService {
  List<GiayEntity> getAll();

  GiayEntity add(GiayDto giayDto);

  GiayEntity update(GiayDto giayDto);

  GiayEntity detail(GiayDto giayDto);

  GiayEntity delete(GiayDto giayDto);

  PageResponse<GiayEntity> findByPagingCriteria(GiayDto giayDto, Pageable pageable);

  GiayEntity assignAnhGiay(@NonNull UUID id, @NonNull List<UUID> anhGiayIds);
  ByteArrayOutputStream exportExcel() throws IOException;
  List<GiayEntity> findByTen(String ten);

}
