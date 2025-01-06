package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_CHI_TIET_HOA_DON")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhGiamGiaHoaDonChiTietEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "TONG_TIEN")
    private BigDecimal tongTien;
    @Column(name = "SO_TIEN_DA_GIAM")
    private BigDecimal soTienDaGiam;
    @Column(name = "TONG_TIEN_THANH_TOAN")
    private BigDecimal tongTienThanhToan;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne
    @JoinColumn(name = "ID_HOA_DON")
    private HoaDonEntity hoaDonEntity;
    @ManyToOne
    @JoinColumn(name = "ID_CHUONG_TRINH_GIAM_GIA_HOA_DON")
    private ChuongTrinhGiamGiaHoaDonEntity chuongTrinhGiamGiaHoaDonEntity;
}
