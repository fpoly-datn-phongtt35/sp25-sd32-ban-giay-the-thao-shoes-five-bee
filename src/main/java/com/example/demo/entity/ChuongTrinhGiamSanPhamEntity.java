package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.UUID;

@Entity
@Table(name = "CHUONG_TRINH_GIAM_GIA_SAN_PHAM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChuongTrinhGiamSanPhamEntity {
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
    @ManyToOne
    @JoinColumn(name = "ID_USER")
    private UserEntity userEntity;

}
