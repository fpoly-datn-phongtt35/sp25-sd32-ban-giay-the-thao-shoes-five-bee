package com.example.demo.service;

import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.dto.request.XuatXuDto;
import com.example.demo.dto.request.XuatXuUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.MauSacEntity;
import com.example.demo.entity.XuatXuEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface XuatXuService {
    List<XuatXuEntity> getAll();
    XuatXuEntity add(XuatXuDto xuatXuDto);
    XuatXuEntity addNhanh(XuatXuDto xuatXuDto);
    XuatXuEntity update(XuatXuUpdateDto xuatXuUpdateDto);
    XuatXuEntity detail(XuatXuUpdateDto xuatXuUpdateDto);
    XuatXuEntity delete(XuatXuUpdateDto xuatXuUpdateDto);
    XuatXuEntity toggleTrangThai(XuatXuUpdateDto xuatXuUpdateDto);
    PageResponse<XuatXuEntity> findByPagingCriteria(XuatXuDto xuatXuDto, Pageable pageable);
}
