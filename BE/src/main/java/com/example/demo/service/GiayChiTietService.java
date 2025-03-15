package com.example.demo.service;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiayChiTietEntity;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.NonNull;
import org.springframework.data.domain.Pageable;

public interface GiayChiTietService {
  GiayChiTietEntity updateSoLuongVaGaiaBan(UUID id, Integer soLuong, BigDecimal giaBan);

  List<GiayChiTietEntity> getAll();

  GiayChiTietEntity add(GiayChiTietDto giayChiTietDto);

  GiayChiTietEntity update(GiayChiTietDto giayChiTietDto);

  GiayChiTietEntity detail(GiayChiTietDto giayChiTietDto);

  GiayChiTietEntity delete(GiayChiTietDto giayChiTietDto);

  PageResponse<GiayChiTietEntity> findByPagingCriteria(
      GiayChiTietDto giayChiTietDto, Pageable pageable);

  GiayChiTietEntity assignAnhGiay(@NonNull UUID id, @NonNull List<UUID> anhGiayIds);

  List<GiayChiTietEntity> getAllGiayChiTietByGiayId(UUID giayId);
}
