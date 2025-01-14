package com.example.demo.service;

import com.example.demo.dto.request.DeGiayDto;
import com.example.demo.dto.request.DeGiayUpdateDto;
import com.example.demo.dto.request.MauSacDto;
import com.example.demo.dto.request.MauSacUpdateDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.DeGiayEntity;
import com.example.demo.entity.MauSacEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DeGiayService {
    List<DeGiayEntity> getAll();
    DeGiayEntity add(DeGiayDto deGiayDto);
    DeGiayEntity addNhanh(DeGiayDto deGiayDto);
    DeGiayEntity update(DeGiayUpdateDto deGiayUpdateDto);
    DeGiayEntity detail(DeGiayUpdateDto deGiayUpdateDto);
    DeGiayEntity delete(DeGiayUpdateDto deGiayUpdateDto);
    PageResponse<DeGiayEntity> findByPagingCriteria(DeGiayDto deGiayDto, Pageable pageable);
}
