package com.example.demo.dto.request;

import com.example.demo.entity.KichCoEntity;
import com.example.demo.entity.MauSacEntity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class GiayChiTietDto extends PageDto {
  private UUID id;

  private UUID idMauSac;

  private UUID idKichCo;

  private BigDecimal giaBan;

  private Integer soLuongTon;

  private Integer trangThai;

  private UUID idGiay;
}
