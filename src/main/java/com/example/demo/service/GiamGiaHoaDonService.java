package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaHoaDonEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaHoaDonService {
  List<GiamGiaHoaDonEntity> getAll();

  GiamGiaHoaDonEntity add(GiamGiaHoaDonDto giamGiaHoaDonDto);

  GiamGiaHoaDonEntity update(GiamGiaHoaDonDto giamGiaHoaDonDto);

  GiamGiaHoaDonEntity detail(GiamGiaHoaDonDto giamGiaHoaDonDto);

  GiamGiaHoaDonEntity delete(GiamGiaHoaDonDto giamGiaHoaDonDto);

  PageResponse<GiamGiaHoaDonEntity> findByPagingCriteria(
      GiamGiaHoaDonDto giamGiaHoaDonDto, Pageable pageable);
}
