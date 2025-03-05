package com.example.demo.service;

import com.example.demo.dto.request.BanHangOnlineRequest;
import com.example.demo.dto.request.HoaDonRequest;
import com.example.demo.entity.HoaDonEntity;

import java.util.List;
import java.util.UUID;

public interface BanHangService {
  HoaDonEntity banHangOnline(
 UUID idGiamGia, Integer hinhThucThanhToan, BanHangOnlineRequest banHangOnlineRequest);
}
