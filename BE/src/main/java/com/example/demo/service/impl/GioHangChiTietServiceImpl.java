package com.example.demo.service.impl;

import com.example.demo.entity.GiayChiTietEntity;
import com.example.demo.entity.GioHangChiTietEntity;
import com.example.demo.entity.GioHangEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.GioHangChiTietRepository;
import com.example.demo.service.GioHangChiTietService;
import com.example.demo.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GioHangChiTietServiceImpl implements GioHangChiTietService {
    @Autowired
    private GioHangChiTietRepository gioHangChiTietRepository;

    @Autowired
    private GioHangService gioHangService;

    @Override
    @Transactional
    public void addToCart(UserEntity userEntity, GiayChiTietEntity giayChiTietEntity, int soLuong) {
        GioHangEntity gioHang = gioHangService.getOrCreateGioHang(userEntity);
        gioHangChiTietRepository.findByGioHangEntityAndGiayChiTietEntity(gioHang, giayChiTietEntity)
                .ifPresentOrElse(gioHangChiTiet -> {
                    gioHangChiTiet.setSoLuong(gioHangChiTiet.getSoLuong() + soLuong);
                    gioHangChiTietRepository.save(gioHangChiTiet);
                }, () -> {
                    GioHangChiTietEntity newGioHangChiTiet = new GioHangChiTietEntity();
                    newGioHangChiTiet.setGioHangEntity(gioHang);
                    newGioHangChiTiet.setGiayChiTietEntity(giayChiTietEntity);
                    newGioHangChiTiet.setSoLuong(soLuong);
                    newGioHangChiTiet.setTrangThai(1);
                    gioHangChiTietRepository.save(newGioHangChiTiet);
                });
    }
}
