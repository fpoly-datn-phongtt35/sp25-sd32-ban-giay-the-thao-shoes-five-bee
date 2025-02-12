package com.example.demo.dto.request;

import java.util.UUID;

public class KhachHangDto {
    private UUID id;
    private String ma;
    private String hoTen;
    private String diaChi;
    private String email;
    private String soDienThoai;

    // Constructor
    public KhachHangDto(UUID id, String ma, String hoTen, String diaChi, String email, String soDienThoai) {
        this.id = id;
        this.ma = ma;
        this.hoTen = hoTen;
        this.diaChi = diaChi;
        this.email = email;
        this.soDienThoai = soDienThoai;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getMa() {
        return ma;
    }

    public String getHoTen() {
        return hoTen;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public String getEmail() {
        return email;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }
}
