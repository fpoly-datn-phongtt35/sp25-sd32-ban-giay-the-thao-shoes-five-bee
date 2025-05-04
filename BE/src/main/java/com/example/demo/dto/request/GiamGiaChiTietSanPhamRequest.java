package com.example.demo.dto.request;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class GiamGiaChiTietSanPhamRequest {

  private String ma;
  private String ten;
  private Integer phanTramGiam;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd",timezone = "Asia/Ho_Chi_Minh")
  private Date ngayBatDau;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd",timezone = "Asia/Ho_Chi_Minh")
  private Date ngayKetThuc;

  private List<UUID> idGiayChiTiet;
}
