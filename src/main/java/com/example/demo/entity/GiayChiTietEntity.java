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

    @OneToMany(mappedBy = "giayChiTietEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MauSacEntity> mauSacEntities;

    @OneToMany(mappedBy = "giayChiTietEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<KichCoEntity> kichCoEntities;

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
