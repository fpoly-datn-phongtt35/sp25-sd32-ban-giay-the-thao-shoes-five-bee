package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Table(name = "HOA_DON_CHI_TIET")
@Entity
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HoaDonChiTietEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_LUONG")
    private Integer soLuong;

    @Column(name = "GIA_BAN")
    private BigDecimal giaBan;

    @Column(name = "DON_GIA")
    private BigDecimal donGia;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "ID_HOA_DON")
    private HoaDonEntity hoaDonEntity;

    @ManyToOne
    @JoinColumn(name = "ID_GIAY_CHI_TIET")
    private GiayChiTietEntity giayChiTietEntity;
}
