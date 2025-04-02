package com.example.demo.dto.request;

import com.example.demo.entity.HoaDonEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.query.Page;

import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class LichSuHoaDonDto extends PageDto {
  private UUID id;

  private HoaDonDto hoaDonDto;

  private Integer trangThaiCu;

  private Integer trangThaiMoi;

  private String nguoiCapNhat;

  private Date thoiGianCapNhat;

  private String ghiChu;

  private String maHoaDon;
}
