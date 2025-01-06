package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_CHI_TIET_SAN_PHAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhGiamGiaChiTietSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_TIEN_DA_GIAM")
    private BigDecimal soTienDaGiam;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "ID_GIAY")
    private GiayEntity giay;

    @ManyToOne
    @JoinColumn(name = "ID_CHUONG_TRINH_GIAM_GIA_SAN_PHAM")
    private ChuongTrinhGiamSanPhamEntity chuongTrinhGiamSanPhamEntity;
}
