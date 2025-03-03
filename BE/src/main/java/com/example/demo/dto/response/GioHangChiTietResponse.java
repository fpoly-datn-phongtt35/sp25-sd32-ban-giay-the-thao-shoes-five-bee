package com.example.demo.dto.response;


import com.example.demo.entity.AnhGiayEntity;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GioHangChiTietResponse {
    private UUID id;
    private UUID giayChiTietId;
    private String tenGiay;
    private String anhGiayUrl;
    private String mauSac;
    private String kichCo;
    private BigDecimal giaBan;
    private Integer soLuong;
}
