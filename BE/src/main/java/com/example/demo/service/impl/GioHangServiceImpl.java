package com.example.demo.service.impl;

import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.GioHangRepository;
import com.example.demo.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public class GioHangServiceImpl implements GioHangService {
    @Autowired
    private GioHangRepository gioHangRepository;
    @Override
    public GioHangEntity getOrCreateGioHang(UserEntity userEntity) {
        return gioHangRepository.findByUserEntity(userEntity)
                .orElseGet(() -> {
                    GioHangEntity newGioHang = new GioHangEntity();
                    newGioHang.setUserEntity(userEntity);
                    newGioHang.setNgayTao(new Date());
                    newGioHang.setNgayCapNhat(new Date());
                    newGioHang.setTrangThai(1);
                    return gioHangRepository.save(newGioHang);
                });
    }
}
