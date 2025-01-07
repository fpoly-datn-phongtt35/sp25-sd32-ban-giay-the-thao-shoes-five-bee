package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Table(name = "GIAY_CHI_TIET")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GiayChiTietEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "ID_MAUSAC")
    private MauSacEntity mauSacEntity;

    @ManyToOne
    @JoinColumn(name = "ID_KICK_CO")
    private KichCoEntity kichCoEntity;

    @Column(name = "GIA_BAN")
    private BigDecimal giaBan;

    @Column(name = "SO_LUONG_TON")
    private Integer soLuongTon;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_GIAY")
    private GiayEntity giayEntity;
}
