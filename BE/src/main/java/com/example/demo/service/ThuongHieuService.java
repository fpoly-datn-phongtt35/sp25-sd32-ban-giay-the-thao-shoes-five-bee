package com.example.demo.service;

import com.example.demo.dto.request.*;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.ThuongHieuEntity;
import com.example.demo.entity.XuatXuEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ThuongHieuService {
    List<ThuongHieuEntity> getAll();
    ThuongHieuEntity add(ThuongHieuDto thuongHieuDto);
    ThuongHieuEntity addNhanh(ThuongHieuDto thuongHieuDto);
    ThuongHieuEntity update(ThuongHieuUpdateDto thuongHieuUpdateDto);
    ThuongHieuEntity detail(ThuongHieuUpdateDto thuongHieuUpdateDto);
    ThuongHieuEntity delete(ThuongHieuUpdateDto thuongHieuUpdateDto);
    ThuongHieuEntity toggleTrangThai(ThuongHieuUpdateDto thuongHieuUpdateDto);
    PageResponse<ThuongHieuEntity> findByPagingCriteria(ThuongHieuDto thuongHieuDto, Pageable pageable);
}
