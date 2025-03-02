package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Table(name = "HOA_DON")
@Entity
@SuperBuilder(toBuilder = true)
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "NGAY_TAO")
    private Date ngayTao;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Column(name = "NGAY_THANH_TOAN")
    private Date ngayThanhToan;

    @Column(name = "MO_TA",columnDefinition = "NVARCHAR(255)")
    private String moTa;

    @Column(name = "TEN_NGUOI_NHAN",columnDefinition = "NVARCHAR(255)")
    private String tenNguoiNhan;

    @Column(name = "SO_DIEN_THOAI_NGUOI_NHAN")
    private String sdtNguoiNhan;

    @Column(name = "XA")
    private String xa;

    @Column(name = "HUYEN")
    private String huyen;

    @Column(name = "TINH")
    private String tinh;

    @Column(name = "DIA_CHI",columnDefinition = "NVARCHAR(255)")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USER",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private UserEntity userEntity;


    @OneToMany(mappedBy = "hoaDonEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoaDonChiTietEntity> items;

    @OneToMany(mappedBy = "hoaDonEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GiamGiaHoaDonChiTietEntity> chuongTrinhGiamGiaChiTietHoaDons;
}
