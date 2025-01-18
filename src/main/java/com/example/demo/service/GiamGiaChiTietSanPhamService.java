package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiamGiaChiTietSanPhamEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaChiTietSanPhamService {
  List<GiamGiaChiTietSanPhamEntity> getAll();

  GiamGiaChiTietSanPhamEntity add(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  GiamGiaChiTietSanPhamEntity update(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  GiamGiaChiTietSanPhamEntity detail(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  GiamGiaChiTietSanPhamEntity delete(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  PageResponse<GiamGiaChiTietSanPhamEntity> findByPagingCriteria(
      GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto, Pageable pageable);
}
