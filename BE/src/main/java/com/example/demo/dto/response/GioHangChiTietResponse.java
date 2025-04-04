package com.example.demo.dto.response;

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
public class GioHangChiTietResponse {
  private UUID id;
  private UUID giayChiTietId;
  private String tenGiay;
  private String anhGiayUrl;
  private String mauSac;
  private String kichCo;
  private BigDecimal giaBan;
  private BigDecimal donGiaKhiGiam;
  private Integer soLuong;
}
