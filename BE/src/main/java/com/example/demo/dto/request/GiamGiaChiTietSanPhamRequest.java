package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaChiTietSanPhamRequest {

    private String ma;
    private String ten;
    private Integer phanTramGiam;
    private Date ngayBatDau;
    private Date ngayKetThuc;

    private List<UUID> idGiayChiTiet;

    //private Integer soLuongTonToiThieu;
}
