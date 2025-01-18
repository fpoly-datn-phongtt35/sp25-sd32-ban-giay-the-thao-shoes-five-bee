package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Table(name = "GIAY")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_THUONG_HIEU",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private ThuongHieuEntity thuongHieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CHAT_LIEU",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private ChatLieuEntity chatLieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DE_GIAY",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private DeGiayEntity deGiay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_XUAT_XU",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private XuatXuEntity xuatXu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_KIEU_DANG",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private KieuDangEntity kieuDang;

    @OneToMany(mappedBy = "giayEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AnhGiayEntity> anhGiayEntities;

    @OneToMany(mappedBy = "giayEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<GiayChiTietEntity> giayChiTietEntities;


}
