package com.example.demo.dto.request;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.UUIDDeserializer;
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
  @JsonDeserialize(using = UUIDDeserializer.class)
  private UUID id;

  private MauSacUpdateDto mauSacDto;

  private KichCoUpdateDto kichCoDto;

  private BigDecimal giaBan;

  private Integer soLuongTon;

  private Integer trangThai;

  private GiayDto giayDto;
}
