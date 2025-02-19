package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_HOA_DON")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaHoaDonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN",columnDefinition = "NVARCHAR(255)")
    private String ten;
    @Column(name = "DIEU_KIEN")
    private BigDecimal dieuKien;
    @Column(name = "SO_TIEN_GIAM_MAX")
    private BigDecimal soTienGiamMax;
    @Column(name = "NGAY_BAT_DAU")
    private Date ngayBatDau;
    @Column(name = "NGAY_KET_THUC")
    private Date ngayKetThuc;
    @Column(name = "PHAN_TRAM_GIAM")
    private Integer phanTramGiam;
    @Column(name = "SO_LUONG")
    private Integer soLuong;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
}
