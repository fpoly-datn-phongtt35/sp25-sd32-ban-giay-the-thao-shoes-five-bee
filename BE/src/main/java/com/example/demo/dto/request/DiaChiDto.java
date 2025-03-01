package com.example.demo.dto.request;

import com.example.demo.entity.UserEntity;
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
    private String xa;
    private String huyen;
    private String thanhPho;
    private String tenNguoiNhan;
    private String tenDiaChi;
    private String sdtNguoiNhan;
    private String diaChiCuThe;
    private Integer trangThai;
    private UserEntity userEntity;
}


