package com.example.demo.dto.request;

import java.math.BigDecimal;
import java.util.UUID;
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
public class GiamGiaHoaDonChiTietDto extends PageDto{
    private UUID id;
    private BigDecimal tongTien;
    private BigDecimal soTienDaGiam;
    private BigDecimal tongTienThanhToan;
    private Integer trangThai;
    private  HoaDonDto hoaDonDto;
    private  GiamGiaHoaDonDto giamGiaHoaDonDto;
}
