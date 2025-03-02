package com.example.demo.dto.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
public class GiayDto extends PageDto {
  @JsonDeserialize(using = UUIDDeserializer.class)
  private UUID id;
  private String ma;
  private String ten;
  private String moTa;
  private BigDecimal giaNhap;
  private BigDecimal giaBan;
  private Integer soLuongTon;
  private Integer trangThai;

  private DanhMucUpdateDto danhMucDto;
  private ThuongHieuUpdateDto thuongHieuDto;
  private ChatLieuUpdateDto chatLieuDto;
  private DeGiayUpdateDto deGiayDto;
  private XuatXuUpdateDto xuatXuDto;
  private KieuDangUpdateDto kieuDangDto;
  private List<AnhGiayDto> anhGiayDtos;
}
