package com.example.demo.service;

import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;

public interface GioHangService {
    GioHangEntity getOrCreateGioHang(UserEntity userEntity);
}
