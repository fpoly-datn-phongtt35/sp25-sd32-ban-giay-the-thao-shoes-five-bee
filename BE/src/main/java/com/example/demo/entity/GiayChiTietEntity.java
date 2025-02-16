package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Table(name = "GIAY_CHI_TIET")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiayChiTietEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "ID")
  private UUID id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ID_MAUSAC", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
  private MauSacEntity mauSacEntity;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ID_KICK_CO", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
  private KichCoEntity kichCoEntity;

  @JoinColumn(name = "MA_VACH")
  private String maVach;

  @Column(name = "GIA_BAN")
  private BigDecimal giaBan;

  @Column(name = "SO_LUONG_TON")
  private Integer soLuongTon;

  @Column(name = "TRANG_THAI")
  private Integer trangThai;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ID_GIAY", foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
  private GiayEntity giayEntity;
}
