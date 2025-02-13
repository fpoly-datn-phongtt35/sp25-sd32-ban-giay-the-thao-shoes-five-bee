package com.example.demo.service;

import com.example.demo.dto.request.KieuDangDto;
import com.example.demo.dto.request.KieuDangUpdateDto;
import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.KieuDangEntity;
import com.example.demo.entity.MauSacEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KieuDangService {
    List<KieuDangEntity> getAll();
    KieuDangEntity add(KieuDangDto kieuDangDto);
    KieuDangEntity update(KieuDangUpdateDto kieuDangUpdateDto);
    KieuDangEntity detail(KieuDangUpdateDto kieuDangUpdateDto);
    KieuDangEntity delete(KieuDangUpdateDto kieuDangUpdateDto);
    PageResponse<KieuDangEntity> findByPagingCriteria(KieuDangDto kieuDangDto, Pageable pageable);
}
