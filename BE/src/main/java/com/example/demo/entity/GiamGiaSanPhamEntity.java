package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.sql.Date;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_SAN_PHAM")
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiamGiaSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private UUID id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN")
    private String ten;
    @Column(name = "PHAN_TRAM_GIAM")
    private Integer phanTramGiam;
    @Column(name = "NGAY_BAT_DAU")
    private Date ngayBatDau;
    @Column(name = "NGAY_KET_THUC")
    private Date ngayKetThuc;
    @Column(name = "TRANG_THAI")
    private Integer trangThai;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_USER",foreignKey = @ForeignKey(value = ConstraintMode.NO_CONSTRAINT))
    private UserEntity userEntity;

}
