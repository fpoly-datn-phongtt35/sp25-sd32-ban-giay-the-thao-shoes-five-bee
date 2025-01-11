package com.example.demo.service;

import com.example.demo.dto.request.GiamGiaChiTietSanPhamDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChuongTrinhGiamGiaChiTietSanPhamEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface GiamGiaChiTietSanPhamService {
  List<ChuongTrinhGiamGiaChiTietSanPhamEntity> getAll();

  ChuongTrinhGiamGiaChiTietSanPhamEntity add(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  ChuongTrinhGiamGiaChiTietSanPhamEntity update(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  ChuongTrinhGiamGiaChiTietSanPhamEntity detail(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  ChuongTrinhGiamGiaChiTietSanPhamEntity delete(GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto);

  PageResponse<ChuongTrinhGiamGiaChiTietSanPhamEntity> findByPagingCriteria(
      GiamGiaChiTietSanPhamDto giamGiaChiTietSanPhamDto, Pageable pageable);
}
