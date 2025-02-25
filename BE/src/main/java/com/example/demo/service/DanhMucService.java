package com.example.demo.service;

import com.example.demo.dto.request.DanhMucDto;
import com.example.demo.dto.request.DanhMucUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.DanhMucEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DanhMucService {
    List<DanhMucEntity> getAll();
    DanhMucEntity add(DanhMucDto danhMucDto);
    DanhMucEntity addNhanh(DanhMucDto danhMucDto);
    DanhMucEntity update(DanhMucUpdateDto danhMucUpdateDto);
    DanhMucEntity detail(DanhMucUpdateDto danhMucUpdateDto);
    DanhMucEntity delete(DanhMucUpdateDto danhMucUpdateDto);
    DanhMucEntity toggleTrangThai (DanhMucUpdateDto danhMucUpdateDto);
    PageResponse<DanhMucEntity> findByPagingCriteria(DanhMucDto danhMucDto, Pageable pageable);
    //danhmuc
}
