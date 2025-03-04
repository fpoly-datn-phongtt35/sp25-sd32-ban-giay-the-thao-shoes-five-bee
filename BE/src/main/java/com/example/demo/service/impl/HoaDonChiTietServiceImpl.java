package com.example.demo.service.impl;

import com.example.demo.entity.HoaDonChiTietEntity;
import com.example.demo.entity.HoaDonEntity;
import com.example.demo.repository.HoaDonChiTietRepository;
import com.example.demo.service.HoaDonChiTietService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class HoaDonChiTietServiceImpl implements HoaDonChiTietService {

    @Autowired
   private final HoaDonChiTietRepository hoaDonChiTietRepository;
    @Override
    public List<HoaDonChiTietEntity> findByHoaDonGetChiTiet(HoaDonEntity hoaDon) {
        return hoaDonChiTietRepository.findByHoaDonGetChiTiet(hoaDon);
    }
}
