package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Table(name = "HOA_DON")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HoaDonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "MA")
    private String ma;

    @Column(name = "NGAY_TAO")
    private Date ngayTao;

    @Column(name = "NGAY_THANH_TOAN")
    private Date ngayThanhToan;

    @Column(name = "MO_TA")
    private String moTa;

    @Column(name = "TEN_NGUOI_NHAN")
    private String tenNguoiNhan;

    @Column(name = "SO_DIEN_THOAI_NGUOI_NHAN")
    private String sdtNguoiNhan;

    @Column(name = "DIA_CHI")
    private String diaChi;

    @Column(name = "TONG_TIEN")
    private BigDecimal tongTien;

    @Column(name = "HINH_THUC_MUA")
    private Integer hinhThucMua;

    @Column(name = "HINH_THUC_THANH_TOAN")
    private Integer hinhThucThanhToan;

    @Column(name = "HINH_THUC_NHAN_HANG")
    private Integer hinhThucNhanHang;

    @Column(name = "SO_TIEN_GIAM")
    private BigDecimal soTienGiam;

    @Column(name = "PHI_SHIP")
    private BigDecimal phiShip;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "ID_USER")
    private UserEntity userEntity;


    @OneToMany(mappedBy = "hoaDonEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoaDonChiTietEntity> items;

    @OneToMany(mappedBy = "hoaDonEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChuongTrinhGiamGiaHoaDonChiTietEntity> chuongTrinhGiamGiaChiTietHoaDons;
}
