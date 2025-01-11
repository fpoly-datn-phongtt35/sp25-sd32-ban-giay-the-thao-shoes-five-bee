package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaHoaDonChiTietDto;
import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonChiTietEntity;
import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GiamGiaHoaDonChiTietService {

  List<ChuongTrinhGiamGiaHoaDonChiTietEntity> getAll();

  ChuongTrinhGiamGiaHoaDonChiTietEntity add(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  ChuongTrinhGiamGiaHoaDonChiTietEntity update(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  ChuongTrinhGiamGiaHoaDonChiTietEntity detail(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  ChuongTrinhGiamGiaHoaDonChiTietEntity delete(GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto);

  PageResponse<ChuongTrinhGiamGiaHoaDonChiTietEntity> findByPagingCriteria(
      GiamGiaHoaDonChiTietDto giamGiaHoaDonChiTietDto, Pageable pageable);
}
