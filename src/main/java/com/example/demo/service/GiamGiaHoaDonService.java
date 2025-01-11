package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaHoaDonDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamGiaHoaDonEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaHoaDonService {
  List<ChuongTrinhGiamGiaHoaDonEntity> getAll();

  ChuongTrinhGiamGiaHoaDonEntity add(GiamGiaHoaDonDto giamGiaHoaDonDto);

  ChuongTrinhGiamGiaHoaDonEntity update(GiamGiaHoaDonDto giamGiaHoaDonDto);

  ChuongTrinhGiamGiaHoaDonEntity detail(GiamGiaHoaDonDto giamGiaHoaDonDto);

  ChuongTrinhGiamGiaHoaDonEntity delete(GiamGiaHoaDonDto giamGiaHoaDonDto);

  PageResponse<ChuongTrinhGiamGiaHoaDonEntity> findByPagingCriteria(
      GiamGiaHoaDonDto giamGiaHoaDonDto, Pageable pageable);
}
