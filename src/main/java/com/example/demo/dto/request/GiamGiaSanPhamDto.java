package com.example.demo.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaSanPhamDto extends PageDto{
    private UUID id;
    private String ma;
    private String ten;
    private Integer phanTramGiam;
    private Date ngayBatDau;
    private Date ngayKetThuc;
    private Integer trangThai;
}
