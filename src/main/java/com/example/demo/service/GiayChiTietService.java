package com.example.demo.service;

import com.example.demo.dto.request.GiayChiTietDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.GiayChiTietEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GiayChiTietService {
    List<GiayChiTietEntity> getAll();

    GiayChiTietEntity add(GiayChiTietDto giayChiTietDto);

    GiayChiTietEntity update(GiayChiTietDto giayChiTietDto);

    GiayChiTietEntity detail(GiayChiTietDto giayChiTietDto);

    GiayChiTietEntity delete(GiayChiTietDto giayChiTietDto);

    PageResponse<GiayChiTietEntity> findByPagingCriteria(
            GiayChiTietDto giayChiTietDto, Pageable pageable);
}
