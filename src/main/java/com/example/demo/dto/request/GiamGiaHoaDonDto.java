package com.example.demo.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaHoaDonDto extends PageDto{
    private UUID id;
    private String ma;
    private String ten;
    private BigDecimal dieuKien;
    private BigDecimal soTienGiamMax;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Integer phanTramGiam;
    private Integer soLuong;
    private Integer trangThai;
}
