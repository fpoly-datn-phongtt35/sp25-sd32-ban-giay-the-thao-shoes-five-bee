package com.example.demo.service;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.MauSacEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MauSacService {
    List<MauSacEntity> getAll();
    MauSacEntity add(MauSacDto mauSacDto);
    MauSacEntity addNhanh(MauSacDto mauSacDto);
    MauSacEntity update(MauSacUpdateDto mauSacUpdateDto);
    MauSacEntity detail(MauSacUpdateDto mauSacUpdateDto);
    MauSacEntity delete(MauSacUpdateDto mauSacUpdateDto);
    PageResponse<MauSacEntity> findByPagingCriteria(MauSacDto mauSacDto, Pageable pageable);
}
