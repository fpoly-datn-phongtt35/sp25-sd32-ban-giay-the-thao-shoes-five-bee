package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class BanHangOnlineRequest {
    private List<UUID> idsGioHangChiTiet;
    private String ma;
    private String moTa;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String xa;
    private String huyen;
    private String tinh;
    private String diaChi;

}
