package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaHoaDonChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaHoaDonChiTietEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GiamGiaHoaDonChiTietService {

  List<GiamGiaHoaDonChiTietEntity> getAll();

  GiamGiaHoaDonChiTietEntity add(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  GiamGiaHoaDonChiTietEntity update(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  GiamGiaHoaDonChiTietEntity detail(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  GiamGiaHoaDonChiTietEntity delete(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  PageResponse<GiamGiaHoaDonChiTietEntity> findByPagingCriteria(
      GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto, Pageable pageable);
}
