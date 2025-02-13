package com.example.demo.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class HoaDonDto {

    private UUID id;

    private String ma;

    private Date ngayTao;

    private Date ngayThanhToan;

    private String moTa;

    private String tenNguoiNhan;

    private String sdtNguoiNhan;

    private String diaChi;

    private BigDecimal tongTien;

    private Integer hinhThucMua;

    private Integer hinhThucThanhToan;

    private Integer hinhThucNhanHang;

    private BigDecimal soTienGiam;

    private BigDecimal phiShip;

    private Integer trangThai;
}
