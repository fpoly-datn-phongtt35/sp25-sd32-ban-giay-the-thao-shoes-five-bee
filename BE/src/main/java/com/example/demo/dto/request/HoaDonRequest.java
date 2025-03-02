package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class HoaDonRequest {
    private String ma;
    private String moTa;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String xa;
    private String huyen;
    private String tinh;
    private String diaChi;
    private Boolean isGiaoHang;
    private String maGiamGia;
}
