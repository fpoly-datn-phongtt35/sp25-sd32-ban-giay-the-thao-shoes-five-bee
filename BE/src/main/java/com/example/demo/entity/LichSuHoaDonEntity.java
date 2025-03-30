package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.sql.Date;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Table(name = "LICH_SU_HOA_DON")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder(toBuilder = true)
public class LichSuHoaDonEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "ID")
  private UUID id;

  @ManyToOne
  @JsonBackReference
  @JoinColumn(name = "ID_HOA_DON")
  private HoaDonEntity hoaDonEntity;

  @Column(name = "TRANG_THAI_CU")
  private Integer trangThaiCu;

  @Column(name = "TRANG_THAI_MOI")
  private Integer trangThaiMoi;

  @Column(name = "NGUOI_CAP_NHAT")
  private String nguoiCapNhat;

  @Column(name = "THOI_GIAN_CAP_NHAT")
  private Date thoiGianCapNhat;

  @Column(name = "GHI_CHU")
  private String ghiChu;
}
