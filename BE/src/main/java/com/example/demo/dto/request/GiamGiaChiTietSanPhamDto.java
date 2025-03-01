package com.example.demo.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaChiTietSanPhamDto extends PageDto{

    private UUID id;
    private BigDecimal soTienDaGiam;
    private Integer trangThai;
    private GiayChiTietDto giayDto;
    private GiamGiaSanPhamDto giamGiaSanPhamDto;
}
