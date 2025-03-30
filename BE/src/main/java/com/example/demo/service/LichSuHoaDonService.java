package com.example.demo.service;

import com.example.demo.dto.request.LichSuHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.LichSuHoaDonEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface LichSuHoaDonService {
  void createLichSuHoaDon(UUID hoaDonId, Integer trangThaiMoi, Integer trangThaiCu);

  List<LichSuHoaDonEntity> getListLichSuHoaDonByHoaDonId(UUID hoaDonId);

  List<LichSuHoaDonEntity> getAll();

  LichSuHoaDonEntity add(LichSuHoaDonDto lichSuHoaDonDto);

  LichSuHoaDonEntity update(LichSuHoaDonDto lichSuHoaDonDto);

  LichSuHoaDonEntity detail(UUID id);

  LichSuHoaDonEntity delete(UUID id);

  PageResponse<LichSuHoaDonEntity> findByPagingCriteria(
      LichSuHoaDonDto lichSuHoaDonDto, Pageable pageable);
}
