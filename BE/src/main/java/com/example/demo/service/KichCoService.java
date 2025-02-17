package com.example.demo.service;

import com.example.demo.dto.request.ChatLieuDto;
import com.example.demo.dto.request.ChatLieuUpdateDto;
import com.example.demo.dto.request.KichCoDto;
import com.example.demo.dto.request.KichCoUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.ChatLieuEntity;
import com.example.demo.entity.KichCoEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KichCoService {
    List<KichCoEntity> getAll();
    KichCoEntity add(KichCoDto kichCoDto);
    KichCoEntity addNhanh(KichCoDto kichCoDto);
    KichCoEntity update(KichCoUpdateDto kichCoUpdateDto);
    KichCoEntity detail(KichCoUpdateDto kichCoUpdateDto);
    KichCoEntity delete(KichCoUpdateDto kichCoUpdateDto);
    KichCoEntity toggleKichCo(KichCoUpdateDto kichCoUpdateDto);
    PageResponse<KichCoEntity> findByPagingCriteria(KichCoDto kichCoDto, Pageable pageable);
}
