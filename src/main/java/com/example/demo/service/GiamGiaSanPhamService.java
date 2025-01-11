package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamSanPhamEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaSanPhamService {
  List<ChuongTrinhGiamSanPhamEntity> getAll();

  ChuongTrinhGiamSanPhamEntity add(GiamGiaSanPhamDto giamGiaSanPhamDto);

  ChuongTrinhGiamSanPhamEntity update(GiamGiaSanPhamDto giamGiaSanPhamDto);

  ChuongTrinhGiamSanPhamEntity detail(GiamGiaSanPhamDto giamGiaSanPhamDto);

  ChuongTrinhGiamSanPhamEntity delete(GiamGiaSanPhamDto giamGiaSanPhamDto);

  PageResponse<ChuongTrinhGiamSanPhamEntity> findByPagingCriteria(
      GiamGiaSanPhamDto giamGiaSanPhamDto, Pageable pageable);
}
