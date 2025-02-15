package com.example.demo.service;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.dto.request.KhachHangDto;
import com.example.demo.dto.request.KichCoUpdateDto;
import com.example.demo.dto.request.XuatXuDto;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.XuatXuEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KhachHangService {
    KhachHangDto createUser(KhachHangDto khachHangDto);
    List<KhachHangDto> getAllUsers();
    Optional<KhachHangDto> getUserById(UUID id);
    KhachHangDto updateUser(UUID id, KhachHangDto updatedKhachHangDto);
    boolean deleteUser(UUID id);
    KhachHangDto getKhachHangDetails(UUID id);


    PageResponse<UserEntity> findByPagingCriteria(KhachHangDto khachHangDto, Pageable pageable);
    KhachHangDto updateAddress(UUID addressId, DiaChiDto updatedDiaChiDto);//neu pop up thi dung cai nay
}
