package com.example.demo.service;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.UserEntity;


public interface GioHangChiTietService {
    void addToCart(UserEntity userEntity, GiayChiTietEntity giayChiTietEntity, int soLuong);
}
