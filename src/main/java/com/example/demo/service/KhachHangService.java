package com.example.demo.service;

import com.example.demo.dto.request.KhachHangDto;
import com.example.demo.entity.UserEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KhachHangService {
    KhachHangDto createUser(KhachHangDto khachHangDto);
    List<KhachHangDto> getAllUsers();
    Optional<KhachHangDto> getUserById(UUID id);
    KhachHangDto updateUser(UUID id, KhachHangDto updatedKhachHangDto);
    boolean deleteUser(UUID id);
}
