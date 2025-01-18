package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_CHI_TIET_SAN_PHAM")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaChiTietSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;

    @Column(name = "SO_TIEN_DA_GIAM")
    private BigDecimal soTienDaGiam;

    @Column(name = "TRANG_THAI")
    private Integer trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GIAY",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private GiayEntity giay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CHUONG_TRINH_GIAM_GIA_SAN_PHAM",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private GiamGiaSanPhamEntity chuongTrinhGiamSanPhamEntity;
}
