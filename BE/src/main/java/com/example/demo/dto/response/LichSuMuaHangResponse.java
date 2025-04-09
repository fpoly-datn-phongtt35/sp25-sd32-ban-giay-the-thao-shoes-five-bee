package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class LichSuMuaHangResponse {
    private String mauSac;
    private String thuongHieu;
    private Integer soLuong;
    private BigDecimal tongTien;
}
