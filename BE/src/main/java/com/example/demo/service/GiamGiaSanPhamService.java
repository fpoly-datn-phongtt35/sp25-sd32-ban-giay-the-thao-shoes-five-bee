package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamRequest;
import com.example.demo.dto.request.GiamGiaSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaSanPhamEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaSanPhamService {

  GiamGiaSanPhamEntity taoChuongTrinhGiamGia(
          GiamGiaChiTietSanPhamRequest giamGiaChiTietSanPhamRequest);
  List<GiamGiaSanPhamEntity> getAll();

  GiamGiaSanPhamEntity add(GiamGiaSanPhamDto giamGiaSanPhamDto);

  GiamGiaSanPhamEntity update(GiamGiaSanPhamDto giamGiaSanPhamDto);

  GiamGiaSanPhamEntity detail(GiamGiaSanPhamDto giamGiaSanPhamDto);

  GiamGiaSanPhamEntity delete(GiamGiaSanPhamDto giamGiaSanPhamDto);

  PageResponse<GiamGiaSanPhamEntity> findByPagingCriteria(
      GiamGiaSanPhamDto giamGiaSanPhamDto, Pageable pageable);
}
