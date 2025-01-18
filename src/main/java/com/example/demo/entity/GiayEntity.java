package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Table(name = "GIAY")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GiayEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @Column(name = "TEN")
    private String ten;

    @Column(name = "MO_TA")
    private String moTa;

    @Column(name = "GIA_NHAP")
    private BigDecimal giaNhap;

    @Column(name = "GIA_BAN")
    private BigDecimal giaBan;

    @Column(name = "SO_LUONG_TON")
    private Integer soLuongTon;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "ID_THUONG_HIEU")
    private ThuongHieuEntity thuongHieu;

    @ManyToOne
    @JoinColumn(name = "ID_CHAT_LIEU")
    private ChatLieuEntity chatLieu;

    @ManyToOne
    @JoinColumn(name = "ID_DE_GIAY")
    private DeGiayEntity deGiay;

    @ManyToOne
    @JoinColumn(name = "ID_XUAT_XU")
    private XuatXuEntity xuatXu;

    @ManyToOne
    @JoinColumn(name = "ID_KIEU_DANG")
    private KieuDangEntity kieuDang;

    @OneToMany(mappedBy = "giayEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnhGiayEntity> anhGiayEntities;

    @OneToMany(mappedBy = "giayEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GiayChiTietEntity> giayChiTietEntities;


}
