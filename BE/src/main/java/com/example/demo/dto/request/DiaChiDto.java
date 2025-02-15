package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiaChiDto {
    private UUID id;
    private String ma;
    private String tenDiaChi;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String xa;
    private String huyen;
    private String thanhPho;
    private Integer trangThai;
}
